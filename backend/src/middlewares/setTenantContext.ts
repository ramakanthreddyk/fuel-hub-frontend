import { Request, Response, NextFunction } from 'express';
import { UserRole, TENANT_HEADER } from '../constants/auth';

export interface AuthPayload {
  userId: string;
  tenantId: string | null;
  role: UserRole;
}

/**
 * Middleware to set tenant schema context from JWT payload
 * SECURITY: Schema name is shared, but role-based access control is enforced by requireRole middleware
 */
export function setTenantContext(req: Request, res: Response, next: NextFunction) {
  // Skip for admin routes
  if (req.path.startsWith('/api/v1/admin')) {
    return next();
  }

  const user = req.user as AuthPayload | undefined;
  const headerTenant = req.headers[TENANT_HEADER] as string | undefined;

  if (user) {
    if (!user.tenantId && headerTenant) {
      user.tenantId = headerTenant;
    }
    if (user.tenantId) {
      req.user = user;
      return next();
    }
  }

  if (headerTenant) {
    (req as any).tenantId = headerTenant;
    return next();
  }

  return res
    .status(400)
    .json({ status: 'error', code: 'TENANT_REQUIRED', message: 'Missing tenant context' });
}