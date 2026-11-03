import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import type { UserRole } from '@beyond/types';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'beyond_beauty_saloon_dev_secret_key_minimum_32_chars_long';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Staff Code is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['OWNER_ADMIN', 'EMPLOYEE', 'CUSTOMER']).optional(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// POST /api/v1/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    // Also accept legacy { email, password }
    const rawBody = {
      identifier: req.body.identifier || req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    const { identifier, password, role } = loginSchema.parse(rawBody);

    // Look up by email OR staffCode
    const cleanIdentifier = identifier.trim();
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { employeeProfile: { staffCode: cleanIdentifier.toUpperCase() } },
        ],
      },
      include: {
        employeeProfile: true,
        customerProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid login credentials.' });
      return;
    }

    // Role verification (if role is requested from Admin or Staff login tab)
    if (role) {
      if (role === 'OWNER_ADMIN' && user.role !== 'OWNER_ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Access denied: Account is not authorized for Admin access.',
        });
        return;
      }
      if (role === 'EMPLOYEE' && user.role !== 'EMPLOYEE') {
        res.status(403).json({
          success: false,
          error: 'Access denied: Account is not registered as Staff.',
        });
        return;
      }
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        error: 'This account has been deactivated. Please contact salon management.',
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ success: false, error: 'Invalid login credentials.' });
      return;
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      employeeProfileId: user.employeeProfile?.id,
      customerProfileId: user.customerProfile?.id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          employeeProfile: user.employeeProfile
            ? {
                id: user.employeeProfile.id,
                staffCode: user.employeeProfile.staffCode,
                displayName: user.employeeProfile.displayName,
                jobTitle: user.employeeProfile.jobTitle,
              }
            : null,
          customerProfile: user.customerProfile
            ? {
                id: user.customerProfile.id,
              }
            : null,
        },
      },
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed.' });
    return;
  }
});

// POST /api/v1/auth/register (Customer Registration)
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        customerProfile: {
          create: {},
        },
      },
      include: {
        customerProfile: true,
      },
    });

    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role as UserRole,
      customerProfileId: newUser.customerProfile?.id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          customerProfile: newUser.customerProfile,
        },
      },
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ success: false, error: 'Registration failed.' });
    return;
  }
});

// GET /api/v1/auth/me
authRouter.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        employeeProfile: true,
        customerProfile: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        employeeProfile: user.employeeProfile,
        customerProfile: user.customerProfile,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
    return;
  }
});

// POST /api/v1/auth/change-password
authRouter.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      res.status(400).json({ success: false, error: 'Current password is incorrect.' });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    res.json({ success: true, message: 'Password updated successfully.' });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update password.' });
    return;
  }
});

// POST /api/v1/auth/logout
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});
