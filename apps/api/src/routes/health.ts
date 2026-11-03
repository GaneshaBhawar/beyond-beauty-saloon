import { Router } from 'express';
import { prisma } from '../db.js';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    // Quick test query to ensure database connection is healthy
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = `error: ${error instanceof Error ? error.message : 'Unknown database error'}`;
  }

  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    service: 'Beyond Beauty Saloon REST API',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    timezone: process.env.APP_TIMEZONE || 'Asia/Kolkata',
  });
});
