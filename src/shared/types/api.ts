/**
 * @file shared/types/api.ts
 * @description API-related type definitions
 */

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: number;
  details?: Record<string, any>;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
}
