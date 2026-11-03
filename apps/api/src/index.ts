import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { publicRouter } from './routes/public.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { appointmentRouter } from './routes/appointments.js';
import { employeeRouter } from './routes/employee.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/public', publicRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/employee', employeeRouter);

// Public aliases for direct route access (PRD compatibility: /api/services, /api/availability, /api/staff)
app.use('/api/v1/services', (req, res, next) => {
  req.url = '/services' + req.url;
  publicRouter(req, res, next);
});
app.use('/api/v1/availability', (req, res, next) => {
  req.url = '/availability' + req.url;
  publicRouter(req, res, next);
});
app.use('/api/v1/staff', (req, res, next) => {
  req.url = '/staff' + req.url;
  publicRouter(req, res, next);
});

// Un-versioned /api aliases
app.use('/api/services', (req, res, next) => {
  req.url = '/services' + req.url;
  publicRouter(req, res, next);
});
app.use('/api/availability', (req, res, next) => {
  req.url = '/availability' + req.url;
  publicRouter(req, res, next);
});
app.use('/api/staff', (req, res, next) => {
  req.url = '/staff' + req.url;
  publicRouter(req, res, next);
});
app.use('/api/appointments', appointmentRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Beyond Beauty Saloon API',
    version: '2.0.0',
    documentation: '/api/v1/health',
    status: 'online',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✨ Beyond Beauty Saloon API is listening on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/v1/health`);
  });
}

export default app;
