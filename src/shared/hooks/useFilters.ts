/**
 * @file shared/hooks/useFilters.ts
 * @description Generic hook for managing filter state and logic
 */

import { useState, useMemo, useCallback } from 'react';

interface UseFiltersOptions<T> {
  initialFilters?: Partial<T>;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
}

interface FilterState<T> {
  filters: T;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  search: string;
}

interface FilterActions<T> {
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  updateFilters: (newFilters: Partial<T>) => void;
  updateSort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  updateSearch: (search: string) => void;
  resetFilters: () => void;
  resetAll: () => void;
}

export function useFilters<T extends Record<string, any>>({
  initialFilters = {} as T,
  defaultSortBy = null,
  defaultSortOrder = 'asc',
}: UseFiltersOptions<T> = {}): FilterState<T> & FilterActions<T> {
  const [filters, setFilters] = useState<T>(initialFilters as T);
  const [sortBy, setSortBy] = useState<string | null>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [search, setSearch] = useState<string>('');

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc' = 'asc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters as T);
  }, [initialFilters]);

  const resetAll = useCallback(() => {
    setFilters(initialFilters as T);
    setSortBy(defaultSortBy);
    setSortOrder(defaultSortOrder);
    setSearch('');
  }, [initialFilters, defaultSortBy, defaultSortOrder]);

  // Memoized filter state for performance
  const filterState = useMemo(() => ({
    filters,
    sortBy,
    sortOrder,
    search,
  }), [filters, sortBy, sortOrder, search]);

  return {
    ...filterState,
    updateFilter,
    updateFilters,
    updateSort,
    updateSearch,
    resetFilters,
    resetAll,
  };
}

// Usage example:
/*
interface StationFilters {
  status: 'all' | 'active' | 'inactive';
  region: string;
}

const StationsPage = () => {
  const {
    filters,
    search,
    sortBy,
    sortOrder,
    updateFilter,
    updateSearch,
    updateSort,
    resetAll
  } = useFilters<StationFilters>({
    initialFilters: { status: 'all', region: '' },
    defaultSortBy: 'name',
    defaultSortOrder: 'asc'
  });

  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => updateSearch(e.target.value)} 
        placeholder="Search stations..."
      />
      <select 
        value={filters.status} 
        onChange={(e) => updateFilter('status', e.target.value as any)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};
*/
