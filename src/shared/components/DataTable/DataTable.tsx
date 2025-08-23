/**
 * @file shared/components/DataTable/DataTable.tsx
 * @description Reusable data table component with sorting, filtering, and pagination
 */

import React from 'react';
import { TableProps } from '@/shared/types/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export function DataTable<T extends { id: string }>(props: Readonly<TableProps<T>>) {
  const {
    data,
    columns,
    isLoading,
    emptyMessage = 'No data available',
    onRowClick,
    selectedRows = [],
    onSelectionChange,
    className = '',
  } = props;
  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleSelectAll = () => {
    if (onSelectionChange) {
      const allSelected = data.length === selectedRows.length;
      const newSelection = allSelected ? [] : data.map(row => row.id);
      onSelectionChange(newSelection);
    }
  };

  const handleRowSelect = (rowId: string) => {
    if (onSelectionChange) {
      const newSelection = selectedRows.includes(rowId)
        ? selectedRows.filter(id => id !== rowId)
        : [...selectedRows, rowId];
      onSelectionChange(newSelection);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3">
            <div className="flex space-x-4">
              {columns.map((col) => (
                <Skeleton key={`skeleton-${String(col.key)}`} className="h-4 w-20" />
              ))}
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={`empty-row`} className="px-4 py-3">
                <div className="flex space-x-4">
                  {columns.map((col) => (
                    <Skeleton key={`skeleton-col-${String(col.key)}`} className="h-4 w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {onSelectionChange && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row)}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                ${selectedRows.includes(row.id) ? 'bg-blue-50' : ''}
              `}
            >
              {onSelectionChange && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-4 py-3 text-sm text-gray-900"
                  style={{ textAlign: column.align || 'left' }}
                >
                  {(() => {
                    if (column.render) {
                      return column.render(row[column.key as keyof T], row);
                    }
                    const value = row[column.key as keyof T];
                    if (typeof value === 'object' && value !== null) {
                      return JSON.stringify(value);
                    }
                    return String(value ?? '-');
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
