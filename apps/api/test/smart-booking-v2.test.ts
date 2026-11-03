import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import { prisma } from '../src/db.js';

describe('Smart Appointment Booking V2 Specification Tests', () => {
  let hairService: any;
  let bookableStylist: any;

  beforeAll(async () => {
    // Clean up test appointments
    await prisma.appointment.deleteMany({
      where: {
        referenceCode: { startsWith: 'BBS-20261120' },
      },
    });

    hairService = await prisma.service.findFirst({
      where: { isActive: true },
    });

    bookableStylist = await prisma.employeeProfile.findFirst({
      where: { isPublicBookable: true, user: { status: 'ACTIVE' } },
    });
  });

  // Test 1: Service Catalog & Detail Retrieval
  it('SRV-01: GET /api/v1/public/services returns active services catalog', async () => {
    const res = await request(app).get('/api/v1/public/services');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('SRV-02: GET /api/v1/public/services/:id returns complete service information', async () => {
    const res = await request(app).get(`/api/v1/public/services/${hairService.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(hairService.name);
    expect(res.body.data.durationMinutes).toBeGreaterThan(0);
    expect(res.body.data.preparationNotes).toBeDefined();
  });

  // Test 2: Eligible Stylist Selection & Privacy
  it('STAFF-01: GET /api/v1/public/staff/eligible returns qualified stylists without sensitive data', async () => {
    const res = await request(app).get(`/api/v1/public/staff/eligible?serviceId=${hairService.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.anyStylistOption).toBeDefined();
    expect(res.body.anyStylistOption.id).toBe('ANY');
    expect(Array.isArray(res.body.staff)).toBe(true);

    // Verify privacy: no salary, personal phone, private email leaked
    for (const st of res.body.staff) {
      expect(st.baseSalaryPaise).toBeUndefined();
      expect(st.phone).toBeUndefined();
      expect(st.email).toBeUndefined();
      expect(st.attendance).toBeUndefined();
      expect(st.displayName).toBeDefined();
      expect(st.jobTitle).toBeDefined();
    }
  });

  // Test 3: Business Hours & Monday Closure
  it('AVAIL-01: Monday is strictly closed and returns zero slots with friendly message', async () => {
    // 2026-11-09 is a Monday
    const res = await request(app).get(`/api/v1/public/availability?serviceId=${hairService.id}&date=2026-11-09`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isClosed).toBe(true);
    expect(res.body.reason).toContain('closed on Mondays');
    expect(res.body.slots).toHaveLength(0);
  });

  it('AVAIL-02: Past date is rejected with isPast: true', async () => {
    const res = await request(app).get(`/api/v1/public/availability?serviceId=${hairService.id}&date=2025-01-01`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isPast).toBe(true);
    expect(res.body.slots).toHaveLength(0);
  });

  // Test 4: Genuine Database Availability Calculation
  it('AVAIL-03: Tuesday-Sunday returns genuine 30-minute interval slots', async () => {
    // 2026-11-18 is a Wednesday
    const res = await request(app).get(`/api/v1/public/availability?serviceId=${hairService.id}&date=2026-11-18`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isClosed).toBe(false);
    expect(res.body.isPast).toBe(false);
    expect(res.body.slots.length).toBeGreaterThan(0);

    const firstSlot = res.body.slots[0];
    expect(firstSlot.time).toBeDefined();
    expect(firstSlot.period).toMatch(/morning|afternoon|evening/);
    expect(typeof firstSlot.available).toBe('boolean');
  });

  // Test 5: Booking Validation Rules
  it('BOOK-01: Rejects booking on Monday with friendly error', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-09', // Monday
        time: '11:00 AM',
        clientName: 'Priya Client',
        clientPhone: '9823512345',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('closed on Mondays');
  });

  it('BOOK-02: Rejects booking for past date', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2025-01-01',
        time: '11:00 AM',
        clientName: 'Priya Client',
        clientPhone: '9823512345',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('past dates');
  });

  it('BOOK-03: Rejects invalid Indian phone number', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '11:00 AM',
        clientName: 'Priya Client',
        clientPhone: '12345', // Invalid
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('10-digit Indian mobile number');
  });

  it('BOOK-04: Rejects booking when service cannot finish before closing time (21:30)', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '09:20 PM', // Only 10 mins before 21:30 closing
        clientName: 'Priya Client',
        clientPhone: '9823512345',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('closing time');
  });

  // Test 6: Concurrency, Idempotency & Auto-Assignment
  it('BOOK-05: Successfully books with Any Available Stylist and returns reference code', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '02:00 PM',
        clientName: 'Sunita Rao',
        clientPhone: '9823577777',
        stylistId: 'ANY',
        idempotencyKey: 'idem-test-sunita-01',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.referenceCode).toMatch(/^BBS-20261120-\d+/);
    expect(res.body.data.stylist).toBeDefined();
    expect(res.body.data.location).toContain('Savedi');
  });

  it('BOOK-06: Idempotent resubmission returns existing appointment without duplicate', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '02:00 PM',
        clientName: 'Sunita Rao',
        clientPhone: '9823577777',
        stylistId: 'ANY',
        idempotencyKey: 'idem-test-sunita-01', // Exact same idempotency key
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.idempotent).toBe(true);
    expect(res.body.data.referenceCode).toMatch(/^BBS-20261120-\d+/);
  });

  it('BOOK-07: Double-booking the same specific stylist at the same time is rejected with 409', async () => {
    // First booking
    const res1 = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '04:00 PM',
        clientName: 'Client Alpha',
        clientPhone: '9823588888',
        stylistId: bookableStylist.id,
      });
    expect(res1.status).toBe(201);

    // Conflicting booking
    const res2 = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId: hairService.id,
        date: '2026-11-20',
        time: '04:00 PM',
        clientName: 'Client Beta',
        clientPhone: '9823599999',
        stylistId: bookableStylist.id,
      });

    expect(res2.status).toBe(409);
    expect(res2.body.success).toBe(false);
    expect(res2.body.code).toBe('SLOT_CONFLICT');
  });

  // Test 7: Admin Integration
  it('ADMIN-01: Public bookings immediately appear in Admin appointment schedule', async () => {
    const adminAppointments = await prisma.appointment.findMany({
      where: {
        referenceCode: { startsWith: 'BBS-20261120' },
      },
      include: {
        customer: { select: { user: true } },
        allocations: { select: { employee: true } },
      },
    });

    expect(adminAppointments.length).toBeGreaterThanOrEqual(2);
    expect(adminAppointments[0].status).toBe('CONFIRMED');
    expect(adminAppointments[0].allocations[0]?.employee).toBeDefined();
  });
});

