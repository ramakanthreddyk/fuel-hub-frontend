export enum UserRole {
  SuperAdmin = 'superadmin',
  Owner = 'owner',
  Manager = 'manager',
  Attendant = 'attendant',
}

export const AUTH_HEADER = 'authorization';
export const TENANT_HEADER = 'x-tenant-id';
export const JWT_EXPIRES_IN = '100y'; // effectively never expires
export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export const REFRESH_TOKEN_EXPIRES_IN = '24h';
