import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect all admin endpoints with OWNER_ADMIN authorization
adminRouter.use(authenticate, authorize('OWNER_ADMIN'));

const createStaffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  staffCode: z.string().optional(),
  employmentStatus: z.enum(['FULL_TIME', 'PART_TIME', 'PROBATION']).default('FULL_TIME'),
  baseSalaryPaise: z.number().int().nonnegative().default(2500000), // Default ₹25,000
  commissionRateBps: z.number().int().nonnegative().default(500), // Default 5%
  isPublicBookable: z.boolean().default(true),
  colorTag: z.string().default('#B78693'),
  serviceIds: z.array(z.string()).optional(),
  initialPassword: z.string().min(6).optional(),
});

const updateStaffSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  jobTitle: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'SUSPENDED']).optional(),
  employmentStatus: z.string().optional(),
  baseSalaryPaise: z.number().optional(),
  commissionRateBps: z.number().optional(),
  isPublicBookable: z.boolean().optional(),
  colorTag: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
  resetPassword: z.boolean().optional(),
  newPassword: z.string().min(6).optional(),
});

// GET /api/v1/admin/staff - Directory of all staff
adminRouter.get('/staff', async (req, res) => {
  try {
    const staff = await prisma.employeeProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        skills: {
          include: {
            service: {
              select: { id: true, name: true, categoryId: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Failed to list staff:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve staff directory.' });
  }
});

// POST /api/v1/admin/staff - Onboard new staff with credentials
adminRouter.post('/staff', async (req, res) => {
  try {
    const data = createStaffSchema.parse(req.body);

    // 1. Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    // 2. Generate unique staffCode if not specified
    let staffCode = data.staffCode?.toUpperCase();
    if (!staffCode) {
      const count = await prisma.employeeProfile.count();
      staffCode = `BBS-${String(count + 1).padStart(4, '0')}`;
    }

    // Check staffCode uniqueness
    const existingCode = await prisma.employeeProfile.findUnique({
      where: { staffCode },
    });

    if (existingCode) {
      staffCode = `BBS-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // 3. Password handling
    const tempPassword = data.initialPassword || `Pass@${Math.floor(100000 + Math.random() * 900000)}`;
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // 4. Atomic creation
    const newStaff = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: 'EMPLOYEE',
          status: 'ACTIVE',
        },
      });

      const profile = await tx.employeeProfile.create({
        data: {
          userId: user.id,
          staffCode,
          displayName: `${data.firstName} (${data.jobTitle})`,
          jobTitle: data.jobTitle,
          employmentStatus: data.employmentStatus,
          baseSalaryPaise: data.baseSalaryPaise,
          commissionRateBps: data.commissionRateBps,
          isPublicBookable: data.isPublicBookable,
          colorTag: data.colorTag,
        },
      });

      // Assign skills if provided
      if (data.serviceIds && data.serviceIds.length > 0) {
        await tx.employeeServiceSkill.createMany({
          data: data.serviceIds.map((srvId) => ({
            employeeId: profile.id,
            serviceId: srvId,
          })),
        });
      }

      // Default shifts: Mon - Sun 10:00 - 20:00
      const days = [0, 1, 2, 3, 4, 5, 6];
      await tx.staffShift.createMany({
        data: days.map((dayOfWeek) => ({
          employeeId: profile.id,
          dayOfWeek,
          shiftStart: '10:00',
          shiftEnd: '20:00',
          breakStart: '13:00',
          breakEnd: '14:00',
          isRecurring: true,
        })),
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'CREATE_STAFF',
          targetType: 'EMPLOYEE',
          targetId: profile.id,
          changes: JSON.stringify({ email: user.email, staffCode, jobTitle: data.jobTitle }),
        },
      });

      return { user, profile };
    });

    res.status(201).json({
      success: true,
      message: 'Staff member onboarded successfully.',
      data: {
        staffId: newStaff.profile.id,
        userId: newStaff.user.id,
        staffCode: newStaff.profile.staffCode,
        fullName: `${newStaff.user.firstName} ${newStaff.user.lastName}`,
        email: newStaff.user.email,
        jobTitle: newStaff.profile.jobTitle,
        temporaryPassword: tempPassword, // Revealed once to owner
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Staff creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create staff account.' });
    return;
  }
});

// PATCH /api/v1/admin/staff/:id - Update profile, status or reset password
adminRouter.patch('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = updateStaffSchema.parse(req.body);

    const profile = await prisma.employeeProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      res.status(404).json({ success: false, error: 'Staff member not found.' });
      return;
    }

    let issuedPassword: string | undefined = undefined;

    await prisma.$transaction(async (tx) => {
      // 1. User updates (Name, status, password)
      const userUpdates: any = {};
      if (body.firstName) userUpdates.firstName = body.firstName;
      if (body.lastName) userUpdates.lastName = body.lastName;
      if (body.status) userUpdates.status = body.status;

      if (body.resetPassword || body.newPassword) {
        issuedPassword = body.newPassword || `Pass@${Math.floor(100000 + Math.random() * 900000)}`;
        userUpdates.passwordHash = await bcrypt.hash(issuedPassword, 10);
      }

      if (Object.keys(userUpdates).length > 0) {
        await tx.user.update({
          where: { id: profile.userId },
          data: userUpdates,
        });
      }

      // 2. Profile updates
      const profileUpdates: any = {};
      if (body.displayName) profileUpdates.displayName = body.displayName;
      if (body.jobTitle) profileUpdates.jobTitle = body.jobTitle;
      if (body.employmentStatus) profileUpdates.employmentStatus = body.employmentStatus;
      if (body.baseSalaryPaise !== undefined) profileUpdates.baseSalaryPaise = body.baseSalaryPaise;
      if (body.commissionRateBps !== undefined) profileUpdates.commissionRateBps = body.commissionRateBps;
      if (body.isPublicBookable !== undefined) profileUpdates.isPublicBookable = body.isPublicBookable;
      if (body.colorTag) profileUpdates.colorTag = body.colorTag;

      if (Object.keys(profileUpdates).length > 0) {
        await tx.employeeProfile.update({
          where: { id },
          data: profileUpdates,
        });
      }

      // 3. Service skills updates
      if (body.serviceIds) {
        await tx.employeeServiceSkill.deleteMany({ where: { employeeId: id } });
        if (body.serviceIds.length > 0) {
          await tx.employeeServiceSkill.createMany({
            data: body.serviceIds.map((sId) => ({ employeeId: id, serviceId: sId })),
          });
        }
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE_STAFF',
          targetType: 'EMPLOYEE',
          targetId: id,
          changes: JSON.stringify(body),
        },
      });
    });

    res.json({
      success: true,
      message: 'Staff profile updated successfully.',
      data: {
        id,
        temporaryPassword: issuedPassword,
      },
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Failed to update staff:', error);
    res.status(500).json({ success: false, error: 'Failed to update staff member.' });
    return;
  }
});

// DELETE /api/v1/admin/staff/:id - Safe archive/disable (no hard delete)
adminRouter.delete('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await prisma.employeeProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      res.status(404).json({ success: false, error: 'Staff member not found.' });
      return;
    }

    // Set user to DISABLED and profile to not bookable
    await prisma.$transaction([
      prisma.user.update({
        where: { id: profile.userId },
        data: { status: 'DISABLED' },
      }),
      prisma.employeeProfile.update({
        where: { id },
        data: { isPublicBookable: false },
      }),
      prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'DISABLE_STAFF',
          targetType: 'EMPLOYEE',
          targetId: id,
          changes: JSON.stringify({ reason: 'Admin deactivated staff account' }),
        },
      }),
    ]);

    res.json({
      success: true,
      message: 'Staff account has been deactivated. Historical records and billing history preserved.',
    });
    return;
  } catch (error) {
    console.error('Failed to disable staff:', error);
    res.status(500).json({ success: false, error: 'Failed to disable staff account.' });
    return;
  }
});

// GET /api/v1/admin/appointments - Full salon appointments
adminRouter.get('/appointments', async (req, res) => {
  try {
    const { date, status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: { select: { user: { select: { firstName: true, lastName: true, phone: true } } } },
        services: { include: { service: true } },
        allocations: {
          include: {
            employee: { select: { id: true, staffCode: true, displayName: true, jobTitle: true } },
          },
        },
      },
      orderBy: { startTime: 'desc' },
      take: 100,
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Failed to get admin appointments:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve appointments.' });
  }
});

// GET /api/v1/admin/stats - Overview metrics
adminRouter.get('/stats', async (req, res) => {
  try {
    const totalAppointments = await prisma.appointment.count();
    const activeStaff = await prisma.employeeProfile.count({
      where: { user: { status: 'ACTIVE' } },
    });
    const completedAppointments = await prisma.appointment.count({
      where: { status: 'COMPLETED' },
    });

    // Approximate revenue from completed appointments
    const invoices = await prisma.invoice.findMany({
      where: { status: 'PAID' },
      select: { totalPaise: true },
    });
    const totalRevenuePaise = invoices.reduce((acc, curr) => acc + curr.totalPaise, 0);

    res.json({
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        activeStaff,
        totalRevenueFormatted: `₹${(totalRevenuePaise / 100).toLocaleString('en-IN')}`,
        totalRevenuePaise,
      },
    });
  } catch (error) {
    console.error('Failed to get stats:', error);
    res.status(500).json({ success: false, error: 'Failed to compute salon statistics.' });
  }
});

// GET /api/v1/admin/inventory - Consumables inventory
adminRouter.get('/inventory', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve inventory.' });
  }
});

// POST /api/v1/admin/inventory/:id/restock
adminRouter.post('/inventory/:id/restock', async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = Number(req.body.quantity) || 5;

    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.update({
        where: { id },
        data: { currentQuantity: { increment: quantity } },
      });

      await tx.stockMovement.create({
        data: {
          itemId: id,
          movementType: 'PURCHASE',
          quantity,
          reason: 'Admin manual restock',
        },
      });

      return item;
    });

    res.json({ success: true, data: updated, message: `Restocked ${quantity} units.` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to restock item.' });
  }
});

// ==========================================
// ADMIN DASHBOARD V2 ENDPOINTS
// ==========================================

function getIstDayRange(dateStr: string): { start: Date; end: Date } {
  // Convert YYYY-MM-DD into start and end of day in Asia/Kolkata (+05:30)
  const start = new Date(`${dateStr}T00:00:00+05:30`);
  const end = new Date(`${dateStr}T23:59:59.999+05:30`);
  return { start, end };
}

// GET /api/v1/admin/dashboard - Comprehensive V2 Dashboard metrics & data
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const rawDate = typeof req.query.date === 'string' ? req.query.date : undefined;
    const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000);
    const dateStr = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) 
      ? rawDate 
      : nowIst.toISOString().split('T')[0];
    
    const range = typeof req.query.range === 'string' ? req.query.range : 'daily'; // 'daily' | 'weekly' | 'monthly'
    const { start: todayStart, end: todayEnd } = getIstDayRange(dateStr);

    // 1. Today's Appointments
    const appointmentsToday = await prisma.appointment.findMany({
      where: {
        startTime: { gte: todayStart, lte: todayEnd },
      },
      include: {
        customer: {
          include: {
            user: { select: { firstName: true, lastName: true, phone: true, email: true } },
          },
        },
        services: {
          include: {
            service: { select: { id: true, name: true, durationMinutes: true, pricePaise: true } },
          },
        },
        allocations: {
          include: {
            employee: { select: { id: true, staffCode: true, displayName: true, jobTitle: true, colorTag: true } },
          },
        },
        visit: {
          include: {
            invoice: {
              include: { payments: true },
            },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const todayAppointmentsCount = appointmentsToday.length;
    const completedAppointmentsToday = appointmentsToday.filter((a) => a.status === 'COMPLETED').length;
    const inServiceAppointmentsToday = appointmentsToday.filter((a) => a.status === 'IN_SERVICE').length;
    const confirmedAppointmentsToday = appointmentsToday.filter((a) => a.status === 'CONFIRMED').length;
    const requestedAppointmentsToday = appointmentsToday.filter((a) => a.status === 'REQUESTED').length;
    const cancelledAppointmentsToday = appointmentsToday.filter((a) => a.status.startsWith('CANCELLED')).length;

    // 2. Financial Metrics for Today
    // 2a. Today's Billed Sales (all invoices created today)
    const todayInvoices = await prisma.invoice.findMany({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      select: { id: true, totalPaise: true, balanceDuePaise: true, paidAmountPaise: true, status: true },
    });
    const todayBilledSalesPaise = todayInvoices.reduce((acc, curr) => acc + curr.totalPaise, 0);

    // 2b. Today's Collections (all payments recorded today)
    const todayPayments = await prisma.payment.findMany({
      where: {
        paymentDate: { gte: todayStart, lte: todayEnd },
      },
      select: { id: true, amountPaise: true, paymentMethod: true },
    });
    const todayCollectionsPaise = todayPayments.reduce((acc, curr) => acc + curr.amountPaise, 0);

    // 2c. Outstanding Customer Dues (all unpaid/partially paid balances across system)
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['ISSUED', 'PARTIALLY_PAID', 'DRAFT'] },
      },
      select: { balanceDuePaise: true },
    });
    const outstandingCustomerDuesPaise = unpaidInvoices.reduce((acc, curr) => acc + curr.balanceDuePaise, 0);

    // 2d. Today's Recorded Operational Expenses
    const todayMovements = await prisma.stockMovement.findMany({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        movementType: 'PURCHASE',
      },
      select: { quantity: true, unitCostPaise: true },
    });
    const todayExpensesPaise = todayMovements.reduce((acc, curr) => acc + curr.quantity * curr.unitCostPaise, 0);

    // 3. Staff Attendance for Today
    const activeStaff = await prisma.employeeProfile.findMany({
      where: { user: { status: 'ACTIVE' } },
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
      },
      orderBy: { staffCode: 'asc' },
    });

    const attendanceRecordsToday = await prisma.attendanceRecord.findMany({
      where: {
        date: { gte: todayStart, lte: todayEnd },
      },
    });

    const attendanceMap = new Map<string, (typeof attendanceRecordsToday)[0]>();
    for (const rec of attendanceRecordsToday) {
      attendanceMap.set(rec.employeeId, rec);
    }

    let staffPresentCount = 0;
    let staffOnLeaveCount = 0;
    let staffAbsentCount = 0;
    let staffNotMarkedCount = 0;

    const staffOverviewList = activeStaff.map((emp) => {
      const rec = attendanceMap.get(emp.id);
      let status = 'NOT_MARKED';
      let checkInTime = null;
      let checkOutTime = null;

      if (rec) {
        status = rec.status;
        checkInTime = rec.checkInTime ? rec.checkInTime.toISOString() : null;
        checkOutTime = rec.checkOutTime ? rec.checkOutTime.toISOString() : null;
      }

      if (status === 'PRESENT' || status === 'LATE' || status === 'HALF_DAY') {
        staffPresentCount++;
      } else if (status === 'ON_LEAVE') {
        staffOnLeaveCount++;
      } else if (status === 'ABSENT') {
        staffAbsentCount++;
      } else {
        staffNotMarkedCount++;
      }

      // Count appointments assigned to this employee today
      const assignedCount = appointmentsToday.filter((a) =>
        a.allocations.some((alloc) => alloc.employeeId === emp.id)
      ).length;

      return {
        id: emp.id,
        staffCode: emp.staffCode,
        fullName: `${emp.user.firstName} ${emp.user.lastName}`,
        displayName: emp.displayName,
        jobTitle: emp.jobTitle,
        colorTag: emp.colorTag,
        status, // 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE' | 'ABSENT' | 'NOT_MARKED'
        checkInTime,
        checkOutTime,
        assignedAppointmentsToday: assignedCount,
      };
    });

    // 4. Low-Stock Alerts
    const allInventory = await prisma.inventoryItem.findMany({
      orderBy: { currentQuantity: 'asc' },
    });
    const lowStockItems = allInventory
      .filter((item) => item.currentQuantity <= item.minAlertQuantity)
      .map((item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        currentQuantity: item.currentQuantity,
        minAlertQuantity: item.minAlertQuantity,
        unit: item.unit,
        deficit: item.minAlertQuantity - item.currentQuantity,
      }));

    // 5. Sales Performance Chart Series (Daily 7 days, Weekly 4 weeks, Monthly 6 months)
    let salesChartData: { label: string; date: string; billedSales: number; collections: number }[] = [];

    if (range === 'weekly') {
      // Past 4 weeks
      for (let w = 3; w >= 0; w--) {
        const wEnd = new Date(todayEnd.getTime() - w * 7 * 86400 * 1000);
        const wStart = new Date(wEnd.getTime() - 7 * 86400 * 1000);
        const wInvoices = await prisma.invoice.findMany({
          where: { createdAt: { gte: wStart, lte: wEnd } },
          select: { totalPaise: true },
        });
        const wPayments = await prisma.payment.findMany({
          where: { paymentDate: { gte: wStart, lte: wEnd } },
          select: { amountPaise: true },
        });
        const billed = wInvoices.reduce((a, c) => a + c.totalPaise, 0) / 100;
        const collected = wPayments.reduce((a, c) => a + c.amountPaise, 0) / 100;
        salesChartData.push({
          label: `Week ${4 - w}`,
          date: wStart.toISOString().split('T')[0],
          billedSales: billed,
          collections: collected,
        });
      }
    } else if (range === 'monthly') {
      // Past 6 months
      const [yearStr, monthStr] = dateStr.split('-');
      const currYear = parseInt(yearStr, 10);
      const currMonth = parseInt(monthStr, 10) - 1; // 0-indexed

      for (let m = 5; m >= 0; m--) {
        const d = new Date(currYear, currMonth - m, 1);
        const mStart = new Date(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01T00:00:00+05:30`);
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const mEnd = new Date(nextMonth.getTime() - 1);

        const mInvoices = await prisma.invoice.findMany({
          where: { createdAt: { gte: mStart, lte: mEnd } },
          select: { totalPaise: true },
        });
        const mPayments = await prisma.payment.findMany({
          where: { paymentDate: { gte: mStart, lte: mEnd } },
          select: { amountPaise: true },
        });
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        salesChartData.push({
          label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
          date: mStart.toISOString().split('T')[0],
          billedSales: mInvoices.reduce((a, c) => a + c.totalPaise, 0) / 100,
          collections: mPayments.reduce((a, c) => a + c.amountPaise, 0) / 100,
        });
      }
    } else {
      // Daily: 7 days up to selected date
      const targetDateObj = new Date(`${dateStr}T12:00:00+05:30`);
      for (let i = 6; i >= 0; i--) {
        const d = new Date(targetDateObj.getTime() - i * 86400 * 1000);
        const dayIso = d.toISOString().split('T')[0];
        const { start: dStart, end: dEnd } = getIstDayRange(dayIso);

        const dInvoices = await prisma.invoice.findMany({
          where: { createdAt: { gte: dStart, lte: dEnd } },
          select: { totalPaise: true },
        });
        const dPayments = await prisma.payment.findMany({
          where: { paymentDate: { gte: dStart, lte: dEnd } },
          select: { amountPaise: true },
        });

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        salesChartData.push({
          label: i === 0 ? 'Today' : `${dayNames[d.getDay()]} (${d.getDate()})`,
          date: dayIso,
          billedSales: dInvoices.reduce((a, c) => a + c.totalPaise, 0) / 100,
          collections: dPayments.reduce((a, c) => a + c.amountPaise, 0) / 100,
        });
      }
    }

    // 6. Monthly Business Summary (Current Month)
    const [y, m] = dateStr.split('-');
    const monthStart = new Date(`${y}-${m}-01T00:00:00+05:30`);
    const nextMonthObj = new Date(parseInt(y, 10), parseInt(m, 10), 1);
    const monthEnd = new Date(nextMonthObj.getTime() - 1);

    const monthInvoices = await prisma.invoice.findMany({
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
      select: { totalPaise: true, balanceDuePaise: true },
    });
    const monthPayments = await prisma.payment.findMany({
      where: { paymentDate: { gte: monthStart, lte: monthEnd } },
      select: { amountPaise: true },
    });
    const monthStock = await prisma.stockMovement.findMany({
      where: { createdAt: { gte: monthStart, lte: monthEnd }, movementType: 'PURCHASE' },
      select: { quantity: true, unitCostPaise: true },
    });

    const monthBilledSalesPaise = monthInvoices.reduce((a, c) => a + c.totalPaise, 0);
    const monthCollectionsPaise = monthPayments.reduce((a, c) => a + c.amountPaise, 0);
    const monthOutstandingDuesPaise = monthInvoices.reduce((a, c) => a + c.balanceDuePaise, 0);
    const monthExpensesPaise = monthStock.reduce((a, c) => a + c.quantity * c.unitCostPaise, 0);
    const monthOperatingResultPaise = monthCollectionsPaise - monthExpensesPaise;

    // 7. Popular Services (Top ranked by completed appointments/service lines)
    const allServices = await prisma.service.findMany({
      select: { id: true, name: true, pricePaise: true },
    });
    const serviceUsage = await prisma.appointmentService.findMany({
      select: { serviceId: true, priceAtBookingPaise: true },
    });
    const serviceCounts = new Map<string, { count: number; revenuePaise: number }>();
    for (const item of serviceUsage) {
      const prev = serviceCounts.get(item.serviceId) || { count: 0, revenuePaise: 0 };
      serviceCounts.set(item.serviceId, {
        count: prev.count + 1,
        revenuePaise: prev.revenuePaise + (item.priceAtBookingPaise || 0),
      });
    }

    const popularServices = allServices
      .map((s) => {
        const stats = serviceCounts.get(s.id) || { count: 0, revenuePaise: 0 };
        return {
          id: s.id,
          name: s.name,
          count: stats.count,
          totalAmountFormatted: `₹${(stats.revenuePaise / 100).toLocaleString('en-IN')}`,
          revenuePaise: stats.revenuePaise,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 8. Payment Methods Breakdown (Historical + Month)
    const allPayments = await prisma.payment.findMany({
      select: { paymentMethod: true, amountPaise: true },
    });
    const paymentMap = new Map<string, { count: number; totalPaise: number }>();
    let totalAllPaymentsPaise = 0;
    for (const p of allPayments) {
      const method = p.paymentMethod || 'OTHER';
      const prev = paymentMap.get(method) || { count: 0, totalPaise: 0 };
      paymentMap.set(method, {
        count: prev.count + 1,
        totalPaise: prev.totalPaise + p.amountPaise,
      });
      totalAllPaymentsPaise += p.amountPaise;
    }

    const standardMethods = ['UPI', 'CASH', 'CARD_AT_COUNTER', 'BANK_TRANSFER'];
    const paymentMethodsBreakdown = standardMethods.map((method) => {
      const data = paymentMap.get(method) || { count: 0, totalPaise: 0 };
      const percentage = totalAllPaymentsPaise > 0 
        ? Math.round((data.totalPaise / totalAllPaymentsPaise) * 100) 
        : 0;
      return {
        method,
        label: method === 'CARD_AT_COUNTER' ? 'Card at Counter' : method === 'BANK_TRANSFER' ? 'Bank Transfer' : method,
        amountFormatted: `₹${(data.totalPaise / 100).toLocaleString('en-IN')}`,
        amountPaise: data.totalPaise,
        count: data.count,
        percentage,
      };
    });

    // 9. Real Actionable Alerts
    const actionableAlerts: { id: string; type: 'LOW_STOCK' | 'UNCONFIRMED_APPOINTMENT' | 'UNPAID_INVOICE' | 'UNMARKED_ATTENDANCE'; title: string; description: string; linkTab: string }[] = [];

    // Alert 1: Low stock
    for (const item of lowStockItems) {
      actionableAlerts.push({
        id: `alert-stock-${item.id}`,
        type: 'LOW_STOCK',
        title: `Low Stock: ${item.name}`,
        description: `Only ${item.currentQuantity} ${item.unit} remaining (Reorder threshold: ${item.minAlertQuantity}).`,
        linkTab: 'INVENTORY',
      });
    }

    // Alert 2: Unconfirmed appointments
    const pendingAppointments = appointmentsToday.filter((a) => a.status === 'REQUESTED');
    for (const apt of pendingAppointments) {
      actionableAlerts.push({
        id: `alert-apt-${apt.id}`,
        type: 'UNCONFIRMED_APPOINTMENT',
        title: `Appointment Awaiting Confirmation`,
        description: `${apt.customer?.user?.firstName || 'Client'} for ${apt.services[0]?.service?.name || 'Service'} at ${new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        linkTab: 'APPOINTMENTS',
      });
    }

    // Alert 3: Unrecorded attendance
    const unmarkedStaff = staffOverviewList.filter((s) => s.status === 'NOT_MARKED');
    if (unmarkedStaff.length > 0) {
      actionableAlerts.push({
        id: 'alert-attendance-unmarked',
        type: 'UNMARKED_ATTENDANCE',
        title: `${unmarkedStaff.length} Staff Attendance Unmarked Today`,
        description: `Attendance not yet recorded for ${unmarkedStaff.map((s) => s.displayName).slice(0, 3).join(', ')}${unmarkedStaff.length > 3 ? '...' : ''}.`,
        linkTab: 'ATTENDANCE',
      });
    }

    // Alert 4: Invoices with balance dues
    if (outstandingCustomerDuesPaise > 0) {
      actionableAlerts.push({
        id: 'alert-outstanding-dues',
        type: 'UNPAID_INVOICE',
        title: `Outstanding Customer Balance Dues`,
        description: `Total of ₹${(outstandingCustomerDuesPaise / 100).toLocaleString('en-IN')} pending counter collection across client invoices.`,
        linkTab: 'BILLING',
      });
    }

    // Return complete Dashboard V2 payload
    res.json({
      success: true,
      data: {
        businessDate: dateStr,
        kpis: {
          todayAppointmentsCount,
          completedAppointmentsToday,
          inServiceAppointmentsToday,
          confirmedAppointmentsToday,
          requestedAppointmentsToday,
          cancelledAppointmentsToday,
          todayBilledSalesFormatted: `₹${(todayBilledSalesPaise / 100).toLocaleString('en-IN')}`,
          todayBilledSalesPaise,
          todayCollectionsFormatted: `₹${(todayCollectionsPaise / 100).toLocaleString('en-IN')}`,
          todayCollectionsPaise,
          outstandingCustomerDuesFormatted: `₹${(outstandingCustomerDuesPaise / 100).toLocaleString('en-IN')}`,
          outstandingCustomerDuesPaise,
          todayRecordedExpensesFormatted: `₹${(todayExpensesPaise / 100).toLocaleString('en-IN')}`,
          todayRecordedExpensesPaise: todayExpensesPaise,
          staffPresentCount,
          totalActiveStaffCount: activeStaff.length,
          lowStockAlertsCount: lowStockItems.length,
        },
        todayAppointments: appointmentsToday.map((a) => {
          const srv = a.services[0]?.service;
          const alloc = a.allocations[0]?.employee;
          const invoice = a.visit?.invoice;
          return {
            id: a.id,
            referenceCode: a.referenceCode,
            clientName: `${a.customer?.user?.firstName || 'Walk-in'} ${a.customer?.user?.lastName || 'Client'}`.trim(),
            clientPhone: a.customer?.user?.phone || 'Not Provided',
            serviceName: srv?.name || 'Salon Service',
            durationMinutes: a.totalDurationMinutes,
            stylistName: alloc?.displayName || 'Unassigned',
            stylistId: alloc?.id || null,
            startTimeFormatted: new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTimeFormatted: new Date(a.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            startTimeIso: a.startTime.toISOString(),
            status: a.status,
            estimatedTotalFormatted: `₹${(a.estimatedTotalPaise / 100).toLocaleString('en-IN')}`,
            estimatedTotalPaise: a.estimatedTotalPaise,
            invoiceStatus: invoice?.status || 'NO_INVOICE',
            paymentStatus: invoice?.status === 'PAID' ? 'PAID' : invoice?.status === 'PARTIALLY_PAID' ? 'PARTIALLY_PAID' : 'PENDING',
          };
        }),
        salesPerformance: {
          range,
          series: salesChartData,
        },
        monthlySummary: {
          periodLabel: `${new Date(monthStart).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
          totalBilledSalesFormatted: `₹${(monthBilledSalesPaise / 100).toLocaleString('en-IN')}`,
          totalBilledSalesPaise: monthBilledSalesPaise,
          totalCollectionsFormatted: `₹${(monthCollectionsPaise / 100).toLocaleString('en-IN')}`,
          totalCollectionsPaise: monthCollectionsPaise,
          recordedExpensesFormatted: `₹${(monthExpensesPaise / 100).toLocaleString('en-IN')}`,
          recordedExpensesPaise: monthExpensesPaise,
          outstandingDuesFormatted: `₹${(monthOutstandingDuesPaise / 100).toLocaleString('en-IN')}`,
          outstandingDuesPaise: monthOutstandingDuesPaise,
          operatingResultFormatted: `₹${(monthOperatingResultPaise / 100).toLocaleString('en-IN')}`,
          operatingResultPaise: monthOperatingResultPaise,
          methodologyNotes: 'Operating result represents verified cash and digital collections received minus recorded operational stock expenses during this calendar month. Outstanding dues remain on client ledger until collected at reception.',
        },
        staffOverview: {
          counts: {
            total: activeStaff.length,
            present: staffPresentCount,
            absent: staffAbsentCount,
            onLeave: staffOnLeaveCount,
            notMarked: staffNotMarkedCount,
          },
          staffList: staffOverviewList,
        },
        popularServices,
        paymentMethodsBreakdown,
        actionableAlerts,
      },
    });
    return;
  } catch (error) {
    console.error('Failed to compute dashboard metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to generate admin dashboard.' });
    return;
  }
});

// POST /api/v1/admin/attendance - Record/update employee attendance
adminRouter.post('/attendance', async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, notes } = req.body;
    if (!employeeId || !status) {
      res.status(400).json({ success: false, error: 'Employee ID and attendance status are required.' });
      return;
    }

    const validStatuses = ['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'ON_LEAVE', 'HOLIDAY', 'OFF_DAY'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const targetDate = date ? new Date(`${date}T00:00:00+05:30`) : new Date(new Date().toISOString().split('T')[0] + 'T00:00:00+05:30');

    const record = await prisma.attendanceRecord.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: targetDate,
        },
      },
      update: {
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : status === 'PRESENT' ? new Date() : undefined,
        correctionReason: notes || undefined,
        isManuallyCorrected: true,
      },
      create: {
        employeeId,
        date: targetDate,
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : status === 'PRESENT' ? new Date() : undefined,
        correctionReason: notes || undefined,
        isManuallyCorrected: true,
      },
    });

    res.json({
      success: true,
      message: 'Attendance recorded successfully.',
      data: record,
    });
    return;
  } catch (error) {
    console.error('Failed to record attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to record staff attendance.' });
    return;
  }
});

// POST /api/v1/admin/customers - Quick-add customer
adminRouter.post('/customers', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, gender, notes } = req.body;
    if (!firstName || !phone) {
      res.status(400).json({ success: false, error: 'First name and phone number are required.' });
      return;
    }

    // Check if user with phone/email exists
    const cleanPhone = phone.trim();
    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          ...(email ? [{ email: email.toLowerCase() }] : []),
        ],
      },
      include: { customerProfile: true },
    });

    if (existingUser?.customerProfile) {
      res.json({
        success: true,
        message: 'Customer already exists.',
        data: {
          customerId: existingUser.customerProfile.id,
          fullName: `${existingUser.firstName} ${existingUser.lastName}`,
          phone: existingUser.phone,
        },
      });
      return;
    }

    const defaultEmail = email ? email.toLowerCase() : `cust.${Date.now()}@beyondbeauty.local`;
    const passwordHash = await bcrypt.hash('CustomerPass123!', 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName: lastName || '',
          phone: cleanPhone,
          email: defaultEmail,
          passwordHash,
          role: 'CUSTOMER',
          status: 'ACTIVE',
        },
      });

      const profile = await tx.customerProfile.create({
        data: {
          userId: user.id,
          gender: gender || null,
          preferredStylistNotes: notes || null,
        },
      });

      return { user, profile };
    });

    res.status(201).json({
      success: true,
      message: 'Customer profile registered successfully.',
      data: {
        customerId: result.profile.id,
        fullName: `${result.user.firstName} ${result.user.lastName}`.trim(),
        phone: result.user.phone,
      },
    });
    return;
  } catch (error) {
    console.error('Failed to create customer:', error);
    res.status(500).json({ success: false, error: 'Failed to create customer.' });
    return;
  }
});

// PATCH /api/v1/admin/appointments/:id/status - Update appointment status with event log
adminRouter.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const validStatuses = ['REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_SERVICE', 'COMPLETED', 'CANCELLED_BY_STAFF', 'NO_SHOW'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
      return;
    }

    const apt = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!apt) {
      res.status(404).json({ success: false, error: 'Appointment not found.' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.appointment.update({
        where: { id },
        data: {
          status,
          cancellationReason: status.startsWith('CANCELLED') ? reason || 'Cancelled by Salon Admin' : undefined,
          cancelledAt: status.startsWith('CANCELLED') ? new Date() : undefined,
        },
      });

      await tx.appointmentEvent.create({
        data: {
          appointmentId: id,
          previousStatus: apt.status,
          newStatus: status,
          actorUserId: req.user!.id,
          reason: reason || 'Status updated via Admin Command Center',
        },
      });

      return result;
    });

    res.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: updated,
    });
    return;
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment status.' });
    return;
  }
});

