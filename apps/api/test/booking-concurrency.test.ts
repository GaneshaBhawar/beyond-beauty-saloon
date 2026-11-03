import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import { prisma } from '../src/db.js';

describe('Booking & Concurrency Conflict Prevention Tests', () => {
  let serviceId: string;
  let stylistId: string;

  beforeAll(async () => {
    const srv = await prisma.service.findFirst({
      where: { isActive: true },
    });
    serviceId = srv!.id;

    const staff = await prisma.employeeProfile.findFirst({
      where: { user: { status: 'ACTIVE' } },
    });
    stylistId = staff!.id;

    // Clean up any previous test runs
    await prisma.appointment.deleteMany({
      where: {
        referenceCode: { startsWith: 'BBS-20261115' },
      },
    });
  });

  const testDate = '2026-11-15';
  const testTime = '11:00 AM';

  it('BOOK-01: Successfully creates booking with verified slot availability', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId,
        date: testDate,
        time: testTime,
        clientName: 'Pooja Kulkarni',
        clientPhone: '+91 98230 55555',
        clientEmail: 'pooja.k@example.com',
        stylistId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.referenceCode).toMatch(/^BBS-20261115-\d+/);
  });

  it('BOOK-02: Simultaneous/conflicting booking for the same stylist and slot is rejected with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({
        serviceId,
        date: testDate,
        time: testTime,
        clientName: 'Concurrent Client',
        clientPhone: '+91 98230 66666',
        stylistId,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('no longer available');
  });
});
