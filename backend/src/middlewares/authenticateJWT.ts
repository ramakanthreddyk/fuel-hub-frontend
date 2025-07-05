import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ status: 'error', code: 'AUTH_REQUIRED', message: 'Missing token' });
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', code: 'INVALID_TOKEN', message: 'Invalid or expired token' });
  }
}
