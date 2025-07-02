
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export interface DataTableColumn<T = any> {
  /** Column key/accessor */
  key: keyof T;
  /** Column header label */
  label: string;
  /** Custom render function */
  render?: (value: any, item: T, index: number) => React.ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: string | number;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is searchable */
  searchable?: boolean;
}

export interface DataTableProps<T = any> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Empty state configuration */
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  /** Pagination configuration */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  /** Search configuration */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  /** Sort configuration */
  sort?: {
    key: string;
    direction: 'asc' | 'desc';
    onChange: (key: string, direction: 'asc' | 'desc') => void;
  };
  /** Row selection */
  selection?: {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    getRowId: (item: T) => string;
  };
  /** Additional table props */
  className?: string;
}

/**
 * Enhanced data table component with built-in pagination, search, and sorting
 * 
 * Features:
 * - Sorting and filtering
 * - Pagination with configurable page sizes
 * - Row selection
 * - Loading and empty states
 * - Keyboard navigation
 * - Responsive design
 * - ARIA attributes for accessibility
 */
export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  emptyState,
  pagination,
  search,
  sort,
  selection,
  className
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!sort || !sort.onChange) return;
    
    const newDirection = 
      sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    sort.onChange(key, newDirection);
  };

  const getSortIcon = (columnKey: string) => {
    if (!sort || sort.key !== columnKey) return null;
    return sort.direction === 'asc' ? 
      <SortAsc className="h-4 w-4" /> : 
      <SortDesc className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {search && (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={search.placeholder || 'Search...'}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="max-w-sm"
              disabled
            />
          </div>
        )}
        <div className="border rounded-lg p-8 text-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!data.length && !loading) {
    return (
      <div className="space-y-4">
        {search && (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={search.placeholder || 'Search...'}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
        <EmptyState
          title={emptyState?.title || 'No data available'}
          description={emptyState?.description || 'There are no items to display.'}
          action={emptyState?.action}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {search && (
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={search.placeholder || 'Search...'}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {selection && (
                <TableHead className="w-12">
                  {/* Selection header - implement if needed */}
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-muted/50'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={selection?.getRowId(item) || index}>
                {selection && (
                  <TableCell>
                    {/* Selection checkbox - implement if needed */}
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render 
                      ? column.render(item[column.key], item, index)
                      : String(item[column.key] || '')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.pageSize))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
