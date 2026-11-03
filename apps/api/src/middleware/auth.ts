import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@beyond/types';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  employeeProfileId?: string;
  customerProfileId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'beyond_beauty_saloon_dev_secret_key_minimum_32_chars_long';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required.' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
    return;
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Access forbidden: insufficient role permissions.' });
      return;
    }

    next();
  };
}
