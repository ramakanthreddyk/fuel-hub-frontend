/**
 * @file shared/types/user.ts
 * @description User-related type definitions
 */

import { ID, Timestamp, UserRole } from './index';

export interface User {
  id: ID;
  userId: ID;
  email: string;
  name?: string;
  role: UserRole;
  tenantId?: ID | null;
  planName?: string;
  isActive?: boolean;
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
  role: UserRole;
  password?: string;
}

export interface UpdateUserRequest {
  id: ID;
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFilters {
  role?: UserRole | 'all';
  isActive?: boolean | 'all';
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  recentLogins: number;
}
