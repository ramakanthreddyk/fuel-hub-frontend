/**
 * @file shared/components/index.ts
 * @description Centralized export of all shared components
 */

// Layout components
export { PageHeader } from './Layout/PageHeader';
export { LoadingSpinner, FullPageLoader, InlineLoader, ButtonLoader } from './Layout/LoadingSpinner';
export { EmptyState, NoDataFound, NoSearchResults, ErrorState } from './Layout/EmptyState';

// Form components
export { FormField, Input, Textarea, Select, Checkbox } from './Forms/FormField';

// Table components
export { DataTable, type Column, type DataTableProps } from './Tables/DataTable';

// Usage example for barrel exports:
/*
// Instead of multiple imports:
import { PageHeader } from './shared/components/Layout/PageHeader';
import { LoadingSpinner } from './shared/components/Layout/LoadingSpinner';
import { FormField } from './shared/components/Forms/FormField';

// Use single import:
import { PageHeader, LoadingSpinner, FormField } from '@/shared/components';
*/
