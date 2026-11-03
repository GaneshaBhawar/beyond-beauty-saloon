import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Admin Staff Onboarding & Account Lifecycle Tests', () => {
  let adminToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@beyondbeauty.local',
        password: 'AdminPassword123!',
        role: 'OWNER_ADMIN',
      });
    adminToken = res.body.data.token;
  });

  const testEmail = `aarti.test_${Date.now()}@beyondbeauty.local`;
  let createdStaffCode: string;
  let tempPassword: string;
  let createdStaffId: string;

  it('STAFF-01: Admin creates a new staff profile with unique ID and credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/staff')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Aarti',
        lastName: 'Shinde',
        email: testEmail,
        phone: '+91 98235 99999',
        jobTitle: 'Hair Spa Specialist',
        employmentStatus: 'FULL_TIME',
        baseSalaryPaise: 2200000,
        commissionRateBps: 500,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.staffCode).toMatch(/^BBS-\d+/);
    expect(res.body.data.temporaryPassword).toBeDefined();

    createdStaffCode = res.body.data.staffCode;
    tempPassword = res.body.data.temporaryPassword;
    createdStaffId = res.body.data.staffId;
  });

  it('STAFF-02: Duplicate staff email is rejected with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/admin/staff')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Duplicate',
        lastName: 'Staff',
        email: testEmail,
        jobTitle: 'Colorist',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  it('STAFF-03: Newly onboarded staff logs in with issued Staff Code and temporary password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: createdStaffCode,
        password: tempPassword,
        role: 'EMPLOYEE',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('EMPLOYEE');
    expect(res.body.data.user.employeeProfile.staffCode).toBe(createdStaffCode);
  });

  it('STAFF-04: Admin deactivates staff -> subsequent login is rejected with 403', async () => {
    // 1. Admin deactivates staff
    const disableRes = await request(app)
      .delete(`/api/v1/admin/staff/${createdStaffId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(disableRes.status).toBe(200);
    expect(disableRes.body.success).toBe(true);

    // 2. Staff tries to login -> denied
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: createdStaffCode,
        password: tempPassword,
        role: 'EMPLOYEE',
      });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.success).toBe(false);
    expect(loginRes.body.error).toContain('deactivated');
  });
});

