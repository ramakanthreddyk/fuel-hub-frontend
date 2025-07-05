import { UserRole } from '../constants/auth';

export interface AdminUserInput {
  email: string;
  password: string;
  name?: string; // Optional, ignored for admin users
}

export interface TenantUserInput extends AdminUserInput {
  role: UserRole;
  stationIds?: string[];
}

export function validateAdminUser(data: any): AdminUserInput {
  const { email, password, name } = data || {};
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  return { email, password, name };
}

export function validateTenantUser(data: any): TenantUserInput {
  const { email, password, role, stationIds } = data || {};
  const base = validateAdminUser({ email, password });
  if (!role || !Object.values(UserRole).includes(role)) {
    throw new Error('Invalid role');
  }
  if (stationIds && !Array.isArray(stationIds)) {
    throw new Error('stationIds must be an array');
  }
  return { ...base, role, stationIds };
}
