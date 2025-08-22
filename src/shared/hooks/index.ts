/**
 * @file shared/hooks/index.ts
 * @description Centralized export of all shared hooks
 */

// Async state hooks
export { useAsyncState } from './useAsyncState';

// Filter and pagination hooks
export { useFilters } from './useFilters';
export { usePagination, paginateArray } from './usePagination';

// Storage hooks
export { useLocalStorage, useSessionStorage } from './useLocalStorage';

// Usage example for barrel exports:
/*
// Instead of multiple imports:
import { useAsyncState } from './shared/hooks/useAsyncState';
import { useFilters } from './shared/hooks/useFilters';
import { usePagination } from './shared/hooks/usePagination';

// Use single import:
import { useAsyncState, useFilters, usePagination } from '@/shared/hooks';
*/
