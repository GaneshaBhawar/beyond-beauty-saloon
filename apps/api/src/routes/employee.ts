import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const employeeRouter = Router();

employeeRouter.use(authenticate, authorize('EMPLOYEE', 'OWNER_ADMIN'));

// GET /api/v1/employee/appointments - Queue of appointments assigned to this staff member
employeeRouter.get('/appointments', async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeProfileId = req.user!.employeeProfileId;

    if (!employeeProfileId) {
      res.status(400).json({ success: false, error: 'No employee profile linked to this user.' });
      return;
    }

    const allocations = await prisma.appointmentAllocation.findMany({
      where: {
        employeeId: employeeProfileId,
      },
      include: {
        appointment: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
            customer: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, phone: true },
                },
              },
            },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const formatted = allocations.map((alloc) => {
      const mainService = alloc.appointment.services[0]?.service;
      return {
        allocationId: alloc.id,
        appointmentId: alloc.appointmentId,
        referenceCode: alloc.appointment.referenceCode,
        status: alloc.appointment.status,
        startTime: alloc.startTime,
        endTime: alloc.endTime,
        serviceName: mainService?.name || 'Salon Treatment',
        pricePaise: mainService?.pricePaise || 0,
        clientName: `${alloc.appointment.customer?.user?.firstName || 'Guest'} ${alloc.appointment.customer?.user?.lastName || 'Client'}`.trim(),
        clientPhone: alloc.appointment.customer?.user?.phone || 'N/A',
        notes: alloc.appointment.customerNotes,
      };
    });

    res.json({ success: true, data: formatted });
    return;
  } catch (error) {
    console.error('Failed to get employee queue:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve assigned queue.' });
    return;
  }
});

// POST /api/v1/employee/service-entry - Employee submits completed service draft
employeeRouter.post('/service-entry', async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, clientNotes } = req.body;
    const employeeProfileId = req.user!.employeeProfileId;

    if (!employeeProfileId) {
      res.status(400).json({ success: false, error: 'No employee profile linked.' });
      return;
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { allocations: true },
    });

    if (!appointment) {
      res.status(404).json({ success: false, error: 'Appointment not found.' });
      return;
    }

    const isAllocated = appointment.allocations.some((a) => a.employeeId === employeeProfileId);
    if (!isAllocated && req.user!.role !== 'OWNER_ADMIN') {
      res.status(403).json({ success: false, error: 'You are not assigned to this appointment.' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'COMPLETED',
          customerNotes: clientNotes ? `${appointment.customerNotes || ''} | Staff note: ${clientNotes}` : appointment.customerNotes,
        },
      });

      const adminUsers = await tx.user.findMany({ where: { role: 'OWNER_ADMIN' } });
      for (const admin of adminUsers) {
        await tx.notification.create({
          data: {
            recipientUserId: admin.id,
            title: 'Service Entry Logged',
            message: `Staff marked appointment ${appointment.referenceCode} as completed.`,
            type: 'BOOKING',
            relatedEntityType: 'APPOINTMENT',
            relatedEntityId: appointmentId,
          },
        });
      }
    });

    res.json({ success: true, message: 'Service completion logged successfully.' });
    return;
  } catch (error) {
    console.error('Service entry failed:', error);
    res.status(500).json({ success: false, error: 'Failed to record service entry.' });
    return;
  }
});

// POST /api/v1/employee/attendance - Daily check-in / check-out
employeeRouter.post('/attendance', async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeProfileId = req.user!.employeeProfileId;
    if (!employeeProfileId) {
      res.status(400).json({ success: false, error: 'No employee profile linked.' });
      return;
    }

    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    const existing = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId: employeeProfileId,
          date: today,
        },
      },
    });

    let record;
    if (!existing) {
      record = await prisma.attendanceRecord.create({
        data: {
          employeeId: employeeProfileId,
          date: today,
          checkInTime: now,
          status: 'PRESENT',
        },
      });
    } else if (!existing.checkOutTime) {
      record = await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: { checkOutTime: now },
      });
    } else {
      record = existing;
    }

    res.json({
      success: true,
      message: existing?.checkOutTime ? 'Already checked out for today.' : !existing ? 'Checked in successfully.' : 'Checked out successfully.',
      data: record,
    });
    return;
  } catch (error) {
    console.error('Attendance failed:', error);
    res.status(500).json({ success: false, error: 'Failed to update attendance.' });
    return;
  }
});

// GET /api/v1/employee/notifications - Persisted in-app notifications
employeeRouter.get('/notifications', async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientUserId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: notifications });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve notifications.' });
    return;
  }
});

// PATCH /api/v1/employee/notifications/:id/read - Mark notification read
employeeRouter.patch('/notifications/:id/read', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id, recipientUserId: req.user!.id },
      data: { isRead: true, readAt: new Date() },
    });
    res.json({ success: true, data: updated });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark notification as read.' });
    return;
  }
});

