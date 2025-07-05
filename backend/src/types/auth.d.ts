import { UserRole } from '../constants/auth';

export interface AuthPayload {
  userId: string;
  tenantId?: string | null;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
