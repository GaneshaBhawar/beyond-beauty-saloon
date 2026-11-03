import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Authentication & RBAC Protection Tests', () => {
  it('AUTH-01: Admin can log in with valid credentials and role OWNER_ADMIN', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@beyondbeauty.local',
        password: 'AdminPassword123!',
        role: 'OWNER_ADMIN',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('OWNER_ADMIN');
    expect(res.body.data.token).toBeDefined();
  });

  it('AUTH-02: Staff can log in using Staff Code EMP-001', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'EMP-001',
        password: 'StaffPassword123!',
        role: 'EMPLOYEE',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('EMPLOYEE');
    expect(res.body.data.user.employeeProfile.staffCode).toBe('EMP-001');
  });

  it('AUTH-03: Wrong password returns 401 Unauthorized without account enumeration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@beyondbeauty.local',
        password: 'IncorrectPassword!',
        role: 'OWNER_ADMIN',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid login credentials');
  });

  it('AUTH-04: Staff credentials entered under Admin role are denied (403 Role Mismatch)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'priya.stylist@beyondbeauty.local',
        password: 'StaffPassword123!',
        role: 'OWNER_ADMIN',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('not authorized for Admin access');
  });

  it('AUTH-05: Admin credentials entered under Staff role are denied (403 Role Mismatch)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@beyondbeauty.local',
        password: 'AdminPassword123!',
        role: 'EMPLOYEE',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('not registered as Staff');
  });

  it('AUTH-06: Anonymous request to protected admin endpoint returns 401', async () => {
    const res = await request(app).get('/api/v1/admin/staff');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('AUTH-07: Staff token used to access admin endpoint returns 403 Forbidden', async () => {
    // 1. Login as staff
    const staffLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'priya.stylist@beyondbeauty.local',
        password: 'StaffPassword123!',
        role: 'EMPLOYEE',
      });

    const token = staffLogin.body.data.token;

    // 2. Call admin endpoint
    const res = await request(app)
      .get('/api/v1/admin/staff')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('insufficient role permissions');
  });
});

