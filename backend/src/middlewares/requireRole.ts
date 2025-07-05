import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/auth';

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: 'Insufficient role' });
    }
    next();
  };
}
