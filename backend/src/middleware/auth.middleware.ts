import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = req.user && req.user.role;
  if (role === 'ADMIN' || role === 'SUPERADMIN' || role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const authorizeSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = req.user && req.user.role;
  if (role === 'SUPERADMIN' || role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'SuperAdmin access required' });
  }
};
