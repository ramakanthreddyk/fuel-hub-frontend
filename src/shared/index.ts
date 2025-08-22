/**
 * @file shared/index.ts
 * @description Main barrel export for all shared modules
 */

// Types
export * from './types';

// Utilities
export * from './utils';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Usage example:
/*
// Instead of multiple imports from different files:
import { Station } from './shared/types/station';
import { formatDate } from './shared/utils/date-helpers';
import { useAsyncState } from './shared/hooks/useAsyncState';
import { PageHeader } from './shared/components/Layout/PageHeader';

// Use single import:
import { Station, formatDate, useAsyncState, PageHeader } from '@/shared';
*/
