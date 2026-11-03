import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';

export const appointmentRouter = Router();

// Indian 10-digit phone number validator: accepts optional +91 or 0, with or without spaces/dashes
const isValidIndianPhone = (val: string): boolean => {
  const clean = val.replace(/[\s-]/g, '');
  return /^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/.test(clean);
};

const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().min(1, 'Time is required'), // e.g. "11:00 AM" or "11:00"
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientPhone: z.string().refine(isValidIndianPhone, {
    message: 'Please enter a valid 10-digit Indian mobile number (e.g. 98235 73781)',
  }),
  clientEmail: z.string().email().optional().or(z.literal('')),
  stylistId: z.string().optional(), // 'ANY' or EmployeeProfile id
  notes: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

function parseSlotDateTime(dateStr: string, timeStr: string, durationMinutes = 60): { start: Date; end: Date; startMinutes: number; endMinutes: number } {
  let [timePart, modifier] = timeStr.trim().split(/\s+/);
  let [hoursStr, minutesStr] = timePart.split(':');
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr || '0', 10);

  if (modifier) {
    const mod = modifier.toUpperCase();
    if (mod === 'PM' && hours < 12) hours += 12;
    if (mod === 'AM' && hours === 12) hours = 0;
  }

  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;

  const hPad = String(hours).padStart(2, '0');
  const mPad = String(minutes).padStart(2, '0');
  const isoLocal = `${dateStr}T${hPad}:${mPad}:00+05:30`;
  const start = new Date(isoLocal);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return { start, end, startMinutes, endMinutes };
}

// POST /api/v1/appointments - Public / Authenticated booking with atomic overlap prevention
appointmentRouter.post('/', async (req, res) => {
  try {
    const body = createAppointmentSchema.parse(req.body);

    // 0. Idempotency Check: if idempotencyKey was already booked, return existing appointment
    if (body.idempotencyKey) {
      const existing = await prisma.appointment.findFirst({
        where: { idempotencyKey: body.idempotencyKey },
        include: {
          services: { include: { service: true } },
          allocations: { include: { employee: true } },
          customer: { include: { user: true } },
        },
      });

      if (existing) {
        return res.status(200).json({
          success: true,
          idempotent: true,
          message: 'Appointment was previously confirmed.',
          data: {
            appointmentId: existing.id,
            referenceCode: existing.referenceCode,
            serviceName: existing.services[0]?.service.name || 'Salon Service',
            date: body.date,
            time: body.time,
            clientName: `${existing.customer.user.firstName} ${existing.customer.user.lastName}`.trim(),
            stylist: existing.allocations[0]?.employee.displayName || 'Assigned Specialist',
            status: existing.status,
            priceFormatted: existing.services[0]?.service.pricePaise
              ? `₹${(existing.services[0].service.pricePaise / 100).toLocaleString('en-IN')}`
              : 'Price on Consultation',
          },
        });
      }
    }

    // 1. Fetch service details (accepts either database ID or slug, with resilient matching)
    const cleanId = body.serviceId.toLowerCase();
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { id: body.serviceId },
          { slug: body.serviceId },
          { slug: cleanId },
          cleanId.includes('layered') ? { slug: 'layered-haircut' } : undefined,
          cleanId.includes('blow') ? { slug: 'classic-blow-dry' } : undefined,
          cleanId.includes('spa') ? { slug: 'nourishing-hair-spa' } : undefined,
          cleanId.includes('facial') || cleanId.includes('glow') ? { slug: 'glow-rejuvenation-facial' } : undefined,
          cleanId.includes('makeup') || cleanId.includes('glam') ? { slug: 'party-glam-makeup' } : undefined,
          cleanId.includes('bridal') ? { slug: 'bridal-makeup-package' } : undefined,
          cleanId.includes('thread') || cleanId.includes('eyebrow') ? { slug: 'eyebrow-upperlip-threading' } : undefined,
        ].filter(Boolean) as any,
        isActive: true,
      },
    });

    if (!service) {
      res.status(404).json({ success: false, error: 'The requested service was not found or is currently inactive.' });
      return;
    }

    // 2. Validate date (Asia/Kolkata timezone)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayKolkataStr = formatter.format(now);

    if (body.date < todayKolkataStr) {
      res.status(400).json({ success: false, error: 'Cannot book appointments for past dates.' });
      return;
    }

    // 3. Check Monday closure (dayOfWeek === 1) & business hours
    const [year, month, day] = body.date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, 6, 0, 0));
    const dayOfWeek = dateObj.getUTCDay();

    const opHour = await prisma.businessOperatingHour.findUnique({
      where: { dayOfWeek },
    });

    if (dayOfWeek === 1 || opHour?.isClosed) {
      res.status(400).json({
        success: false,
        error: 'Beyond Beauty Saloon is closed on Mondays. Please choose Tuesday through Sunday.',
      });
      return;
    }

    // 4. Check Business Closure (holiday / renovation)
    const closure = await prisma.businessClosure.findFirst({
      where: {
        closureDate: {
          gte: new Date(`${body.date}T00:00:00+05:30`),
          lte: new Date(`${body.date}T23:59:59+05:30`),
        },
        isFullDay: true,
      },
    });

    if (closure) {
      res.status(400).json({
        success: false,
        error: closure.reason || 'Beyond Beauty Saloon is closed on this date.',
      });
      return;
    }

    const durationMinutes = service.durationMinutes || 60;
    const bufferAfterMinutes = service.bufferAfterMinutes || 5;
    const { start: startTime, end: actualEndTime, startMinutes, endMinutes } = parseSlotDateTime(
      body.date,
      body.time,
      durationMinutes
    );

    // 5. Operating hours boundary check: must finish before salon closing time
    const [openH, openM] = (opHour?.openTime || '08:30').split(':').map(Number);
    const [closeH, closeM] = (opHour?.closeTime || '21:30').split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (startMinutes < openMinutes) {
      res.status(400).json({
        success: false,
        error: `Appointments cannot start before salon opening time (${opHour?.openTime || '08:30'}).`,
      });
      return;
    }

    if (endMinutes > closeMinutes) {
      res.status(400).json({
        success: false,
        error: `This service (${durationMinutes} mins) cannot be completed before salon closing time (${opHour?.closeTime || '21:30'}). Please pick an earlier slot.`,
      });
      return;
    }

    // Allocation end includes buffer
    const allocationEndTime = new Date(startTime.getTime() + (durationMinutes + bufferAfterMinutes) * 60 * 1000);

    // 6. Identify candidate staff members
    let candidateStaffIds: string[] = [];

    if (body.stylistId && body.stylistId !== 'ANY') {
      const staff = await prisma.employeeProfile.findUnique({
        where: { id: body.stylistId },
        include: { user: true, skills: true },
      });
      if (staff && staff.user.status === 'ACTIVE' && staff.isPublicBookable) {
        candidateStaffIds = [staff.id];
      } else {
        res.status(400).json({ success: false, error: 'The chosen specialist is currently unavailable for booking.' });
        return;
      }
    }

    if (candidateStaffIds.length === 0) {
      const eligibleStaff = await prisma.employeeProfile.findMany({
        where: {
          isPublicBookable: true,
          user: { status: 'ACTIVE' },
          skills: { some: { serviceId: service.id } },
        },
        select: { id: true },
      });

      if (eligibleStaff.length > 0) {
        candidateStaffIds = eligibleStaff.map((s) => s.id);
      } else {
        // Fallback: any active bookable staff
        const allBookable = await prisma.employeeProfile.findMany({
          where: {
            isPublicBookable: true,
            user: { status: 'ACTIVE' },
          },
          select: { id: true },
        });
        candidateStaffIds = allBookable.map((s) => s.id);
      }
    }

    if (candidateStaffIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No active specialists are available for scheduling this service.' });
    }

    // 7. Atomic transaction: check conflicts & book slot with concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      let assignedStaffId: string | null = null;

      for (const staffId of candidateStaffIds) {
        // Check for conflicting allocations
        const conflict = await tx.appointmentAllocation.findFirst({
          where: {
            employeeId: staffId,
            startTime: { lt: allocationEndTime },
            endTime: { gt: startTime },
            appointment: {
              status: {
                notIn: ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_STAFF', 'REJECTED'],
              },
            },
          },
        });

        // Check time off
        const timeOff = await tx.timeOff.findFirst({
          where: {
            employeeId: staffId,
            startTime: { lt: allocationEndTime },
            endTime: { gt: startTime },
            status: { in: ['APPROVED', 'PENDING'] },
          },
        });

        if (!conflict && !timeOff) {
          assignedStaffId = staffId;
          break;
        }
      }

      // Race condition / double-booking conflict check
      if (!assignedStaffId) {
        throw new Error('SLOT_CONFLICT');
      }

      // Find or create customer profile
      let customerId: string | undefined = undefined;
      let customerUser = await tx.user.findFirst({
        where: {
          OR: [
            body.clientEmail ? { email: body.clientEmail.toLowerCase() } : undefined,
            { phone: body.clientPhone },
          ].filter(Boolean) as any,
        },
        include: { customerProfile: true },
      });

      if (customerUser?.customerProfile) {
        customerId = customerUser.customerProfile.id;
      } else {
        const guestEmail = body.clientEmail ? body.clientEmail.toLowerCase() : `guest_${Date.now()}_${Math.random().toString(36).substring(7)}@beyondbeauty.local`;
        const names = body.clientName.trim().split(/\s+/);
        const firstName = names[0] || 'Guest';
        const lastName = names.slice(1).join(' ') || 'Client';

        const guestUser = await tx.user.create({
          data: {
            email: guestEmail,
            phone: body.clientPhone,
            firstName,
            lastName,
            passwordHash: 'GUEST_UNREGISTERED',
            role: 'CUSTOMER',
            status: 'ACTIVE',
            customerProfile: { create: {} },
          },
          include: { customerProfile: true },
        });
        customerId = guestUser.customerProfile!.id;
      }

      // Generate reference code e.g. BBS-20261103-4921
      const dateCompact = body.date.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const referenceCode = `BBS-${dateCompact}-${randomSuffix}`;

      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          referenceCode,
          customerId,
          status: 'CONFIRMED',
          startTime,
          endTime: actualEndTime,
          totalDurationMinutes: durationMinutes,
          estimatedTotalPaise: service.pricePaise || 0,
          customerNotes: body.notes,
          idempotencyKey: body.idempotencyKey || null,
        },
      });

      // Create appointmentService
      await tx.appointmentService.create({
        data: {
          appointmentId: appointment.id,
          serviceId: service.id,
          durationMinutes,
          priceAtBookingPaise: service.pricePaise,
        },
      });

      // Create allocation (duration + buffer)
      await tx.appointmentAllocation.create({
        data: {
          appointmentId: appointment.id,
          employeeId: assignedStaffId,
          startTime,
          endTime: allocationEndTime,
        },
      });

      // Fetch assigned staff profile
      const assignedEmployee = await tx.employeeProfile.findUnique({
        where: { id: assignedStaffId },
        include: { user: true },
      });

      // Persist in-app notification for assigned employee
      if (assignedEmployee) {
        await tx.notification.create({
          data: {
            recipientUserId: assignedEmployee.userId,
            title: 'New Appointment Assigned',
            message: `${body.clientName} booked ${service.name} on ${body.date} at ${body.time}.`,
            type: 'BOOKING',
            relatedEntityType: 'APPOINTMENT',
            relatedEntityId: appointment.id,
          },
        });
      }

      return { appointment, assignedEmployee };
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully with verified availability.',
      data: {
        appointmentId: result.appointment.id,
        referenceCode: result.appointment.referenceCode,
        serviceName: service.name,
        date: body.date,
        time: body.time,
        clientName: body.clientName,
        stylist: result.assignedEmployee?.displayName || 'Assigned Specialist',
        status: result.appointment.status,
        priceFormatted: service.pricePaise ? `₹${(service.pricePaise / 100).toLocaleString('en-IN')}` : 'Price on Consultation',
        location: 'Beyond Beauty Saloon, Savedi, Ahilyanagar',
      },
    });
    return;
  } catch (error: any) {
    if (error.message === 'SLOT_CONFLICT') {
      res.status(409).json({
        success: false,
        code: 'SLOT_CONFLICT',
        error: 'The selected time slot is no longer available. Please select another slot.',
      });
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0]?.message || 'Validation failed', details: error.errors });
      return;
    }
    console.error('Booking failed:', error);
    res.status(500).json({ success: false, error: 'Booking failed. Please try again.' });
    return;
  }
});

// GET /api/v1/appointments - List appointments based on caller role
appointmentRouter.get('/', authenticate, async (req, res) => {
  try {
    const userRole = req.user!.role;
    let whereClause: any = {};

    if (userRole === 'EMPLOYEE') {
      if (!req.user!.employeeProfileId) {
        res.status(403).json({ success: false, error: 'Employee profile not associated.' });
        return;
      }
      whereClause = {
        allocations: {
          some: {
            employeeId: req.user!.employeeProfileId,
          },
        },
      };
    } else if (userRole === 'CUSTOMER') {
      if (!req.user!.customerProfileId) {
        res.status(403).json({ success: false, error: 'Customer profile not associated.' });
        return;
      }
      whereClause = {
        customerId: req.user!.customerProfileId,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
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
      take: 50,
    });

    res.json({ success: true, data: appointments });
    return;
  } catch (error) {
    console.error('Failed to list appointments:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve appointments.' });
    return;
  }
});

// PATCH /api/v1/appointments/:id/status - Role-guarded status transition
appointmentRouter.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { allocations: true },
    });

    if (!appointment) {
      res.status(404).json({ success: false, error: 'Appointment not found.' });
      return;
    }

    // Role-based permission checks
    if (userRole === 'EMPLOYEE') {
      const isAssigned = appointment.allocations.some((a) => a.employeeId === req.user!.employeeProfileId);
      if (!isAssigned) {
        res.status(403).json({ success: false, error: 'You are not assigned to this appointment.' });
        return;
      }
      if (!['IN_SERVICE', 'COMPLETED', 'NO_SHOW'].includes(status)) {
        res.status(403).json({ success: false, error: 'Employees can only transition to IN_SERVICE or COMPLETED.' });
        return;
      }
    } else if (userRole === 'CUSTOMER') {
      if (appointment.customerId !== req.user!.customerProfileId) {
        res.status(403).json({ success: false, error: 'You do not own this appointment.' });
        return;
      }
      if (status !== 'CANCELLED_BY_CUSTOMER') {
        res.status(403).json({ success: false, error: 'Customers can only cancel appointments.' });
        return;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.appointment.update({
        where: { id },
        data: {
          status,
          cancellationReason: status.startsWith('CANCELLED') ? reason : undefined,
          cancelledAt: status.startsWith('CANCELLED') ? new Date() : undefined,
        },
      });

      await tx.appointmentEvent.create({
        data: {
          appointmentId: id,
          previousStatus: appointment.status,
          newStatus: status,
          actorUserId: req.user!.id,
          reason: reason || null,
        },
      });

      return res;
    });

    res.json({ success: true, data: updated, message: `Appointment status updated to ${status}.` });
    return;
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment status.' });
    return;
  }
});

// PATCH /api/v1/appointments/:id/reschedule - Reschedule appointment with conflict check
appointmentRouter.patch('/:id/reschedule', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      res.status(400).json({ success: false, error: 'Both date (YYYY-MM-DD) and time are required to reschedule.' });
      return;
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        services: { include: { service: true } },
        allocations: { include: { employee: true } },
      },
    });

    if (!appointment) {
      res.status(404).json({ success: false, error: 'Appointment not found.' });
      return;
    }

    const durationMinutes = appointment.totalDurationMinutes || 60;
    const { start: newStartTime, end: newEndTime } = parseSlotDateTime(date, time, durationMinutes);
    const assignedStaffId = appointment.allocations[0]?.employeeId;

    if (assignedStaffId) {
      // Check for conflict
      const conflict = await prisma.appointmentAllocation.findFirst({
        where: {
          employeeId: assignedStaffId,
          appointmentId: { not: id },
          startTime: { lt: newEndTime },
          endTime: { gt: newStartTime },
          appointment: {
            status: { notIn: ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_STAFF', 'REJECTED'] },
          },
        },
      });

      if (conflict) {
        res.status(409).json({ success: false, error: 'The specialist has a conflicting appointment at the selected time.' });
        return;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const apt = await tx.appointment.update({
        where: { id },
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
        },
      });

      if (assignedStaffId) {
        await tx.appointmentAllocation.updateMany({
          where: { appointmentId: id },
          data: {
            startTime: newStartTime,
            endTime: newEndTime,
          },
        });
      }

      await tx.appointmentEvent.create({
        data: {
          appointmentId: id,
          previousStatus: appointment.status,
          newStatus: appointment.status,
          actorUserId: req.user!.id,
          reason: `Rescheduled to ${date} at ${time}`,
        },
      });

      return apt;
    });

    res.json({ success: true, message: 'Appointment rescheduled successfully.', data: updated });
  } catch (error) {
    console.error('Failed to reschedule appointment:', error);
    res.status(500).json({ success: false, error: 'Failed to reschedule appointment.' });
  }
});
