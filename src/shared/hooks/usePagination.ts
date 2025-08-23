/**
 * @file shared/hooks/usePagination.ts
 * @description Generic hook for pagination logic
 */

import { useState, useMemo, useCallback } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialTotal?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  initialTotal = 0,
}: UsePaginationOptions = {}): PaginationState & PaginationActions {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotalState] = useState(initialTotal);

  // Calculate derived state
  const paginationState = useMemo(() => {
    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    return {
      currentPage,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startIndex,
      endIndex,
    };
  }, [currentPage, pageSize, total]);

  // Actions
  const goToPage = useCallback((page: number) => {
    const maxPage = Math.ceil(total / pageSize);
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  }, [total, pageSize]);

  const goToNextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationState.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (paginationState.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationState.hasPrevPage]);

  const setPageSizeValue = useCallback((size: number) => {
    setPageSize(size);
    // Reset to first page when page size changes
    setCurrentPage(1);
  }, []);

  const setTotal = useCallback((newTotal: number) => {
    setTotalState(newTotal);
    
    // Adjust current page if it's now out of bounds
    const maxPage = Math.ceil(newTotal / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, pageSize]);

  const reset = useCallback(() => {
  setCurrentPage(initialPage);
  setPageSize(initialPageSize);
  setTotalState(initialTotal);
  }, [initialPage, initialPageSize, initialTotal]);

  return {
    ...paginationState,
    goToPage,
    goToNextPage,
    goToPrevPage,
    setPageSize: setPageSizeValue,
    setTotal,
    reset,
  };
}

// Utility function to paginate an array
export function paginateArray<T>(
  array: T[],
  currentPage: number,
  pageSize: number
): T[] {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

// Usage example:
/*
const StationsPage = () => {
  const pagination = usePagination({
    initialPageSize: 20,
    initialTotal: stations.length
  });

  const paginatedStations = useMemo(
    () => paginateArray(filteredStations, pagination.currentPage, pagination.pageSize),
    [filteredStations, pagination.currentPage, pagination.pageSize]
  );

  useEffect(() => {
    pagination.setTotal(filteredStations.length);
  }, [filteredStations.length]);

  return (
    <div>
      <StationsList stations={paginatedStations} />
      <PaginationControls
        {...pagination}
        onPageChange={pagination.goToPage}
        onNextPage={pagination.goToNextPage}
        onPrevPage={pagination.goToPrevPage}
      />
    </div>
  );
};
*/
