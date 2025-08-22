/**
 * @file shared/types/index.ts
 * @description Centralized type definitions for FuelSync application
 */

// Common utility types (define here to avoid circular deps)
export type ID = string;
export type Timestamp = string;
export type Currency = number;

export type EntityStatus = 'active' | 'inactive' | 'maintenance';
export type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';

// Re-export all domain types
export * from './fuel';
export * from './station'; 
export * from './pump';
export * from './nozzle';
export * from './reading';
export * from './user';
export * from './api';
export * from './ui';

// Generic API response patterns
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

// Form patterns
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}
