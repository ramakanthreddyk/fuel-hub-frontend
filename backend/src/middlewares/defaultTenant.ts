import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to set default tenant for routes that need it
 */
export function defaultTenant(req: Request, _res: Response, next: NextFunction) {
  // Skip for admin and auth routes
  if (req.path.startsWith('/api/v1/admin') || req.path.startsWith('/api/v1/auth')) {
    return next();
  }

  next();
}