import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to debug request details
 */
export function debugRequest(req: Request, _res: Response, next: NextFunction) {
  console.log('==== DEBUG REQUEST ====');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Tenant ID:', req.headers['x-tenant-id']);
  console.log('==== END DEBUG ====');
  next();
}