import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Admin Dashboard V2 & Operations API Tests', () => {
  let adminToken: string;
  let staffToken: string;
  let sampleEmployeeId: string;
  let sampleAppointmentId: string;

  beforeAll(async () => {
    // 1. Admin Login
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@beyondbeauty.local',
        password: 'AdminPassword123!',
        role: 'OWNER_ADMIN',
      });
    adminToken = adminRes.body.data.token;

    // 2. Staff Login
    const staffRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'EMP-001',
        password: 'StaffPassword123!',
        role: 'EMPLOYEE',
      });
    staffToken = staffRes.body.data.token;

    // 3. Get employee list to pick an employeeId
    const staffListRes = await request(app)
      .get('/api/v1/admin/staff')
      .set('Authorization', `Bearer ${adminToken}`);
    if (staffListRes.body.data?.length > 0) {
      sampleEmployeeId = staffListRes.body.data[0].id;
    }

    // 4. Get appointments list to pick an appointmentId
    const aptsRes = await request(app)
      .get('/api/v1/admin/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    if (aptsRes.body.data?.length > 0) {
      sampleAppointmentId = aptsRes.body.data[0].id;
    }
  });

  it('DASH-01: Anonymous request to /api/v1/admin/dashboard is denied (401 Unauthorized)', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('DASH-02: Non-admin employee token is denied access (403 Forbidden)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('DASH-03: Admin can retrieve comprehensive Dashboard V2 payload (200 OK)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard?date=2026-11-03&range=daily')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const { kpis, staffOverview, salesPerformance, monthlySummary, popularServices, paymentMethodsBreakdown } = res.body.data;
    
    // Validate KPI structure
    expect(kpis.todayAppointmentsCount).toBeDefined();
    expect(kpis.todayBilledSalesFormatted).toBeDefined();
    expect(kpis.todayCollectionsFormatted).toBeDefined();
    expect(kpis.outstandingCustomerDuesFormatted).toBeDefined();
    expect(kpis.staffPresentCount).toBeDefined();
    expect(kpis.totalActiveStaffCount).toBeGreaterThan(0);

    // Validate Staff Overview
    expect(staffOverview.counts).toBeDefined();
    expect(Array.isArray(staffOverview.staffList)).toBe(true);

    // Validate Sales Trends
    expect(salesPerformance.range).toBe('daily');
    expect(Array.isArray(salesPerformance.series)).toBe(true);

    // Validate Monthly Summary
    expect(monthlySummary.totalBilledSalesFormatted).toBeDefined();
    expect(monthlySummary.methodologyNotes).toContain('Operating result');

    // Validate Services & Payment Methods
    expect(Array.isArray(popularServices)).toBe(true);
    expect(Array.isArray(paymentMethodsBreakdown)).toBe(true);
  });

  it('DASH-04: Admin can record staff attendance via POST /api/v1/admin/attendance', async () => {
    if (!sampleEmployeeId) return;

    const res = await request(app)
      .post('/api/v1/admin/attendance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        employeeId: sampleEmployeeId,
        date: '2026-11-03',
        status: 'PRESENT',
        notes: 'Shift check-in recorded via admin dashboard test',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PRESENT');
  });

  it('DASH-05: Admin can quick-add customer via POST /api/v1/admin/customers', async () => {
    const uniquePhone = `9822${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await request(app)
      .post('/api/v1/admin/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Shruti',
        lastName: 'Kulkarni',
        phone: uniquePhone,
        notes: 'Prefers layered haircuts and organic products',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toContain('Shruti');
  });

  it('DASH-06: Admin can transition appointment status via PATCH /api/v1/admin/appointments/:id/status', async () => {
    if (!sampleAppointmentId) return;

    const res = await request(app)
      .patch(`/api/v1/admin/appointments/${sampleAppointmentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_SERVICE',
        reason: 'Client seated in Styling Chair 1',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('IN_SERVICE');
  });
});

