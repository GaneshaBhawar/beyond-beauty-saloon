import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Phase 0 Baseline API Tests', () => {
  it('GET /api/v1/health should return ok status and server metadata', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toContain('Beyond Beauty Saloon');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.timezone).toBe('Asia/Kolkata');
  });

  it('GET /api/v1/public/business should return verified business contacts', async () => {
    const res = await request(app).get('/api/v1/public/business');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Beyond Beauty Saloon');
    expect(res.body.data.primaryContact).toBe('+91 98235 73781');
    expect(res.body.data.alternateContact).toBe('+91 97307 68487');
    expect(res.body.data.address).toContain('Savedi');
    expect(res.body.data.indicativeRating).toBe(4.7);
    expect(res.body.data.ratingDisclaimer).toBeDefined();
  });
});
