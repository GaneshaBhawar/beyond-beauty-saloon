import { Router } from 'express';
import { prisma } from '../db.js';
import type { BusinessInfoDto } from '@beyond/types';

export const publicRouter = Router();

// Helper: Format hours & minutes into 12-hour AM/PM
function formatTime12(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mStr = String(minutes).padStart(2, '0');
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`;
}

// Helper: Get Asia/Kolkata current date and minutes from midnight
function getKolkataTimeInfo(): { todayStr: string; nowMinutes: number; nowKolkata: Date } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  for (const p of parts) partMap[p.type] = p.value;
  const todayStr = `${partMap.year}-${partMap.month}-${partMap.day}`;
  const nowMinutes = parseInt(partMap.hour, 10) * 60 + parseInt(partMap.minute, 10);
  return { todayStr, nowMinutes, nowKolkata: now };
}

// GET /api/v1/public/business
publicRouter.get('/business', async (req, res) => {
  try {
    const hours = await prisma.businessOperatingHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const businessInfo: BusinessInfoDto = {
      name: 'Beyond Beauty Saloon',
      tagline: 'Premium Hair, Skin, Grooming & Bridal Care in Ahilyanagar',
      address: 'Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar, Maharashtra 414003, India',
      primaryContact: '+91 98235 73781',
      alternateContact: '+91 97307 68487',
      instagramUrl: 'https://www.instagram.com/beyond__beauty_saloon/',
      indicativeRating: 4.7,
      ratingDisclaimer: 'Indicative rating sourced from public web directories. Sourced review moderation awaiting owner confirmation.',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      hours: hours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        dayName: dayNames[h.dayOfWeek] || `Day ${h.dayOfWeek}`,
        isClosed: h.isClosed,
        openTime: h.openTime,
        closeTime: h.closeTime,
      })),
    };

    res.json({ success: true, data: businessInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve business information.' });
  }
});

// GET /api/v1/public/services - List categories with active services
publicRouter.get('/services', async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve services catalog.' });
  }
});

// GET /api/v1/public/services/:id - Get individual service details with pricing & preparation
publicRouter.get('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.toLowerCase();
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
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
      include: {
        category: true,
      },
    });

    if (!service) {
      res.status(404).json({ success: false, error: 'Service not found or inactive.' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: service.id,
        slug: service.slug,
        name: service.name,
        categoryId: service.categoryId,
        categoryName: service.category.name,
        categorySlug: service.category.slug,
        durationMinutes: service.durationMinutes,
        bufferAfterMinutes: service.bufferAfterMinutes,
        pricePaise: service.pricePaise,
        priceFormatted: service.pricePaise ? `₹${(service.pricePaise / 100).toLocaleString('en-IN')}` : 'Price on Consultation',
        isPriceVariable: service.isPriceVariable,
        requiresConsultation: service.requiresConsultation,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        preparationNotes: service.preparationNotes || 'Please arrive 5 to 10 minutes prior to your scheduled time. Wear comfortable clothing.',
        aftercareNotes: service.aftercareNotes,
        isFeatured: service.isFeatured,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve service details.' });
  }
});

// GET /api/v1/public/staff/eligible?serviceId=... - List eligible stylists for a service
publicRouter.get('/staff/eligible', async (req, res) => {
  try {
    const serviceId = req.query.serviceId as string;
    if (!serviceId) {
      res.status(400).json({ success: false, error: 'serviceId query parameter is required.' });
      return;
    }

    // Find service with resilient matching
    const cleanId = serviceId.toLowerCase();
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { id: serviceId },
          { slug: serviceId },
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
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }

    // Find active bookable employees
    const allStaff = await prisma.employeeProfile.findMany({
      where: {
        isPublicBookable: true,
        user: { status: 'ACTIVE' },
      },
      include: {
        skills: {
          include: { service: true },
        },
      },
    });

    // Check staff who have skill for this service
    const skilledStaff = allStaff.filter((st) =>
      st.skills.some((sk) => sk.serviceId === service.id)
    );

    // If explicit skills are mapped, use them; otherwise fallback to all active bookable staff
    const eligibleStaff = skilledStaff.length > 0 ? skilledStaff : allStaff;

    // Sanitize data: NEVER expose salary, private phone, email, attendance, or internal notes
    const sanitizedStaff = eligibleStaff.map((st) => ({
      id: st.id,
      staffCode: st.staffCode,
      displayName: st.displayName,
      jobTitle: st.jobTitle,
      colorTag: st.colorTag,
      specialties: st.skills.map((sk) => sk.service.name),
      bio: st.jobTitle
        ? `${st.displayName} is a ${st.jobTitle} at Beyond Beauty Saloon dedicated to high-precision care and personalized beauty excellence.`
        : 'Dedicated beauty and styling specialist.',
    }));

    res.json({
      success: true,
      serviceName: service.name,
      serviceId: service.id,
      anyStylistOption: {
        id: 'ANY',
        displayName: 'Any Available Stylist',
        jobTitle: 'Fastest booking assignment (Recommended)',
        colorTag: '#B76E79',
        bio: 'We will pair your treatment with the first available qualified specialist on your selected date and time.',
      },
      staff: sanitizedStaff,
    });
  } catch (error) {
    console.error('Error fetching eligible staff:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve eligible stylists.' });
  }
});

// GET /api/v1/public/availability?serviceId=...&date=YYYY-MM-DD&staffId=... - Real calculation
publicRouter.get('/availability', async (req, res) => {
  try {
    const serviceId = req.query.serviceId as string;
    const dateStr = req.query.date as string;
    const staffId = (req.query.staffId as string) || 'ANY';

    if (!serviceId || !dateStr) {
      res.status(400).json({
        success: false,
        error: 'Both serviceId and date (YYYY-MM-DD) query parameters are required.',
      });
      return;
    }

    // 1. Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Expected YYYY-MM-DD.',
      });
      return;
    }

    const { todayStr, nowMinutes } = getKolkataTimeInfo();

    // 2. Reject past dates
    if (dateStr < todayStr) {
      const pastResult = {
        date: dateStr,
        isPast: true,
        isClosed: false,
        message: 'Cannot book appointments for past dates.',
        slots: [],
      };
      res.json({
        success: true,
        data: pastResult,
        ...pastResult,
      });
      return;
    }

    // 3. Find service details with resilient alias matching
    const cleanId = serviceId.toLowerCase();
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { id: serviceId },
          { slug: serviceId },
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
      res.status(404).json({ success: false, error: 'Service not found or inactive.' });
      return;
    }

    // 4. Calculate day of week in Asia/Kolkata (0=Sun, 1=Mon, ..., 6=Sat)
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, 6, 0, 0)); // Midday UTC to safely get day
    const dayOfWeek = dateObj.getUTCDay();

    // 5. Check business operating hours for that day
    const opHour = await prisma.businessOperatingHour.findUnique({
      where: { dayOfWeek },
    });

    if (dayOfWeek === 1 || opHour?.isClosed) {
      const closedResult = {
        date: dateStr,
        isPast: false,
        isClosed: true,
        reason: 'Beyond Beauty Saloon is closed on Mondays. We welcome you Tuesday through Sunday from 8:30 AM to 9:30 PM.',
        slots: [],
      };
      res.json({
        success: true,
        data: closedResult,
        ...closedResult,
      });
      return;
    }

    // 6. Check business closures (special holidays / maintenance closures)
    const closure = await prisma.businessClosure.findFirst({
      where: {
        closureDate: {
          gte: new Date(`${dateStr}T00:00:00+05:30`),
          lte: new Date(`${dateStr}T23:59:59+05:30`),
        },
        isFullDay: true,
      },
    });

    if (closure) {
      const closureResult = {
        date: dateStr,
        isPast: false,
        isClosed: true,
        reason: closure.reason || 'Salon is closed on this date.',
        slots: [],
      };
      res.json({
        success: true,
        data: closureResult,
        ...closureResult,
      });
      return;
    }

    // 7. Determine operating hours for this day
    const openTimeStr = opHour?.openTime || '08:30';
    const closeTimeStr = opHour?.closeTime || '21:30';

    const [openH, openM] = openTimeStr.split(':').map(Number);
    const [closeH, closeM] = closeTimeStr.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // 8. Find eligible staff candidates
    const allBookableStaff = await prisma.employeeProfile.findMany({
      where: {
        isPublicBookable: true,
        user: { status: 'ACTIVE' },
      },
      include: {
        skills: true,
        shifts: {
          where: { dayOfWeek },
        },
        timeOff: {
          where: {
            status: { in: ['APPROVED', 'PENDING'] },
          },
        },
      },
    });

    // Filter staff with skill if skills exist
    const staffWithSkill = allBookableStaff.filter((st) =>
      st.skills.some((sk) => sk.serviceId === service.id)
    );
    let candidateStaff = staffWithSkill.length > 0 ? staffWithSkill : allBookableStaff;

    if (staffId && staffId !== 'ANY') {
      candidateStaff = candidateStaff.filter((st) => st.id === staffId);
      if (candidateStaff.length === 0) {
        res.json({
          success: true,
          date: dateStr,
          isPast: false,
          isClosed: false,
          message: 'The selected specialist is not qualified or unavailable for this service.',
          slots: [],
        });
        return;
      }
    }

    if (candidateStaff.length === 0) {
      res.json({
        success: true,
        date: dateStr,
        isPast: false,
        isClosed: false,
        message: 'No specialists are currently assigned to this service.',
        slots: [],
      });
      return;
    }

    // 9. Fetch all existing non-cancelled allocations for candidate staff on this date
    const dayStart = new Date(`${dateStr}T00:00:00+05:30`);
    const dayEnd = new Date(`${dateStr}T23:59:59+05:30`);

    const existingAllocations = await prisma.appointmentAllocation.findMany({
      where: {
        employeeId: { in: candidateStaff.map((st) => st.id) },
        startTime: { lte: dayEnd },
        endTime: { gte: dayStart },
        appointment: {
          status: {
            notIn: ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_STAFF', 'REJECTED'],
          },
        },
      },
      select: {
        employeeId: true,
        startTime: true,
        endTime: true,
      },
    });

    // 10. Compute 30-minute interval slots
    const serviceDuration = service.durationMinutes || 60;
    const serviceBuffer = service.bufferAfterMinutes || 5;
    const totalSlotRequired = serviceDuration + serviceBuffer;

    const slots: Array<{
      time: string;
      time24: string;
      period: 'morning' | 'afternoon' | 'evening';
      startIso: string;
      available: boolean;
      availableStaffIds: string[];
      availableStaffNames: string[];
    }> = [];

    const isToday = dateStr === todayStr;

    for (let startMin = openMinutes; startMin + serviceDuration <= closeMinutes; startMin += 30) {
      // If booking for today, require at least 30 minutes advance notice
      if (isToday && startMin < nowMinutes + 30) {
        continue;
      }

      const h = Math.floor(startMin / 60);
      const m = startMin % 60;
      const hPad = String(h).padStart(2, '0');
      const mPad = String(m).padStart(2, '0');
      const time24 = `${hPad}:${mPad}`;
      const time12 = formatTime12(h, m);

      let period: 'morning' | 'afternoon' | 'evening' = 'morning';
      if (startMin >= 12 * 60 && startMin < 17 * 60) period = 'afternoon';
      else if (startMin >= 17 * 60) period = 'evening';

      const slotStart = new Date(`${dateStr}T${hPad}:${mPad}:00+05:30`);
      const slotEnd = new Date(slotStart.getTime() + totalSlotRequired * 60 * 1000);

      // Check which candidate staff are free during this slot
      const freeStaff: typeof candidateStaff = [];

      for (const staff of candidateStaff) {
        // a) Check shift
        const shift = staff.shifts[0]; // Filtered by dayOfWeek above
        if (shift) {
          const [shStartH, shStartM] = shift.shiftStart.split(':').map(Number);
          const [shEndH, shEndM] = shift.shiftEnd.split(':').map(Number);
          const shiftStartMin = shStartH * 60 + shStartM;
          const shiftEndMin = shEndH * 60 + shEndM;

          if (startMin < shiftStartMin || startMin + serviceDuration > shiftEndMin) {
            continue; // Outside shift
          }

          // Check break overlap
          if (shift.breakStart && shift.breakEnd) {
            const [brkStartH, brkStartM] = shift.breakStart.split(':').map(Number);
            const [brkEndH, brkEndM] = shift.breakEnd.split(':').map(Number);
            const breakStartMin = brkStartH * 60 + brkStartM;
            const breakEndMin = brkEndH * 60 + brkEndM;

            const appointmentEndMin = startMin + serviceDuration;
            if (startMin < breakEndMin && appointmentEndMin > breakStartMin) {
              continue; // Overlaps with staff lunch break
            }
          }
        }

        // b) Check TimeOff
        const hasTimeOff = staff.timeOff.some(
          (to) => to.startTime < slotEnd && to.endTime > slotStart
        );
        if (hasTimeOff) {
          continue;
        }

        // c) Check existing appointment allocations
        const hasConflict = existingAllocations.some(
          (alloc) =>
            alloc.employeeId === staff.id &&
            alloc.startTime < slotEnd &&
            alloc.endTime > slotStart
        );
        if (hasConflict) {
          continue;
        }

        freeStaff.push(staff);
      }

      const isSlotAvailable =
        staffId === 'ANY' ? freeStaff.length > 0 : freeStaff.some((st) => st.id === staffId);

      slots.push({
        time: time12,
        time24,
        period,
        startIso: slotStart.toISOString(),
        available: isSlotAvailable,
        availableStaffIds: freeStaff.map((st) => st.id),
        availableStaffNames: freeStaff.map((st) => st.displayName),
      });
    }

    const availableSlotsCount = slots.filter((s) => s.available).length;

    const availabilityResult = {
      date: dateStr,
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: serviceDuration,
      bufferMinutes: serviceBuffer,
      operatingHours: `${openTimeStr} - ${closeTimeStr}`,
      isClosed: false,
      isPast: false,
      isFullyBooked: availableSlotsCount === 0 && slots.length > 0,
      availableSlotsCount,
      totalSlotsCount: slots.length,
      message:
        availableSlotsCount === 0 && slots.length > 0
          ? "We're fully booked at that time. Would another slot or date work for you?"
          : undefined,
      slots,
    };

    res.json({
      success: true,
      data: availabilityResult,
      ...availabilityResult,
    });
  } catch (error) {
    console.error('Error calculating availability:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate appointment availability.' });
  }
});

// GET /api/v1/public/offers
publicRouter.get('/offers', async (req, res) => {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve promotional offers.' });
  }
});
