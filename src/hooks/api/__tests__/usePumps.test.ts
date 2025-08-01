/**
 * @file hooks/api/__tests__/usePumps.test.ts
 * @description Comprehensive tests for usePumps API hook
 */
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePumps, usePump, useCreatePump, useUpdatePump, useDeletePump } from '../usePumps';

// Mock API client
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('@/lib/api', () => ({
  apiClient: mockApiClient,
}));

// Mock toast notifications
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock data
const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    status: 'active',
    stationId: 'station-1',
    stationName: 'Station A',
    nozzleCount: 4,
    fuelTypes: ['gasoline', 'diesel'],
    lastMaintenance: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    status: 'maintenance',
    stationId: 'station-1',
    stationName: 'Station A',
    nozzleCount: 2,
    fuelTypes: ['gasoline'],
    lastMaintenance: '2024-01-10T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
];

const mockPump = mockPumps[0];

const mockCreatePumpData = {
  name: 'New Pump',
  serialNumber: 'SN003',
  stationId: 'station-2',
  nozzleCount: 6,
  fuelTypes: ['gasoline', 'diesel', 'premium'],
};

const mockUpdatePumpData = {
  name: 'Updated Pump',
  status: 'inactive',
  nozzleCount: 8,
};

describe('usePumps Hook', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('usePumps (Query)', () => {
    it('fetches pumps successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPumps });

      const { result } = renderHook(() => usePumps(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPumps);
      expect(mockApiClient.get).toHaveBeenCalledWith('/pumps');
    });

    it('handles fetch error', async () => {
      const error = new Error('Failed to fetch pumps');
      mockApiClient.get.mockRejectedValue(error);

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('supports query filters', async () => {
      const filters = { stationId: 'station-1', status: 'active' };
      mockApiClient.get.mockResolvedValue({ data: [mockPumps[0]] });

      const { result } = renderHook(() => usePumps(filters), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/pumps', { params: filters });
    });

    it('handles empty results', async () => {
      mockApiClient.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('supports pagination', async () => {
      const paginatedData = {
        data: mockPumps,
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };
      mockApiClient.get.mockResolvedValue({ data: paginatedData });

      const { result } = renderHook(() => usePumps({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/pumps', {
        params: { page: 1, limit: 10 },
      });
    });

    it('handles network timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockApiClient.get.mockRejectedValue(timeoutError);

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(timeoutError);
    });

    it('handles server errors', async () => {
      const serverError = new Error('Internal Server Error');
      serverError.name = 'ServerError';
      mockApiClient.get.mockRejectedValue(serverError);

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(serverError);
    });
  });

  describe('usePump (Single Query)', () => {
    it('fetches single pump successfully', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPump });

      const { result } = renderHook(() => usePump('1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPump);
      expect(mockApiClient.get).toHaveBeenCalledWith('/pumps/1');
    });

    it('handles pump not found', async () => {
      const notFoundError = new Error('Pump not found');
      notFoundError.name = 'NotFoundError';
      mockApiClient.get.mockRejectedValue(notFoundError);

      const { result } = renderHook(() => usePump('999'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(notFoundError);
    });

    it('skips query when id is not provided', () => {
      const { result } = renderHook(() => usePump(''), { wrapper });

      expect(result.current.isIdle).toBe(true);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it('handles null id gracefully', () => {
      const { result } = renderHook(() => usePump(null as any), { wrapper });

      expect(result.current.isIdle).toBe(true);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it('handles undefined id gracefully', () => {
      const { result } = renderHook(() => usePump(undefined as any), { wrapper });

      expect(result.current.isIdle).toBe(true);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('useCreatePump (Mutation)', () => {
    it('creates pump successfully', async () => {
      const createdPump = { ...mockCreatePumpData, id: '3' };
      mockApiClient.post.mockResolvedValue({ data: createdPump });

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate(mockCreatePumpData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdPump);
      expect(mockApiClient.post).toHaveBeenCalledWith('/pumps', mockCreatePumpData);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Pump created successfully',
      });
    });

    it('handles creation error', async () => {
      const error = new Error('Failed to create pump');
      mockApiClient.post.mockRejectedValue(error);

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate(mockCreatePumpData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to create pump',
        variant: 'destructive',
      });
    });

    it('handles validation errors', async () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      mockApiClient.post.mockRejectedValue(validationError);

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate(mockCreatePumpData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(validationError);
    });

    it('supports custom success callback', async () => {
      const createdPump = { ...mockCreatePumpData, id: '3' };
      mockApiClient.post.mockResolvedValue({ data: createdPump });

      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCreatePump({ onSuccess }), { wrapper });

      result.current.mutate(mockCreatePumpData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(createdPump);
    });

    it('supports custom error callback', async () => {
      const error = new Error('Creation failed');
      mockApiClient.post.mockRejectedValue(error);

      const onError = vi.fn();
      const { result } = renderHook(() => useCreatePump({ onError }), { wrapper });

      result.current.mutate(mockCreatePumpData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('useUpdatePump (Mutation)', () => {
    it('updates pump successfully', async () => {
      const updatedPump = { ...mockPump, ...mockUpdatePumpData };
      mockApiClient.put.mockResolvedValue({ data: updatedPump });

      const { result } = renderHook(() => useUpdatePump(), { wrapper });

      result.current.mutate({ id: '1', data: mockUpdatePumpData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedPump);
      expect(mockApiClient.put).toHaveBeenCalledWith('/pumps/1', mockUpdatePumpData);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Pump updated successfully',
      });
    });

    it('handles update error', async () => {
      const error = new Error('Failed to update pump');
      mockApiClient.put.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdatePump(), { wrapper });

      result.current.mutate({ id: '1', data: mockUpdatePumpData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to update pump',
        variant: 'destructive',
      });
    });

    it('handles partial updates', async () => {
      const partialUpdate = { name: 'Partially Updated Pump' };
      const updatedPump = { ...mockPump, ...partialUpdate };
      mockApiClient.put.mockResolvedValue({ data: updatedPump });

      const { result } = renderHook(() => useUpdatePump(), { wrapper });

      result.current.mutate({ id: '1', data: partialUpdate });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.put).toHaveBeenCalledWith('/pumps/1', partialUpdate);
    });

    it('handles concurrent updates', async () => {
      const conflictError = new Error('Conflict: Resource was modified');
      conflictError.name = 'ConflictError';
      mockApiClient.put.mockRejectedValue(conflictError);

      const { result } = renderHook(() => useUpdatePump(), { wrapper });

      result.current.mutate({ id: '1', data: mockUpdatePumpData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(conflictError);
    });
  });

  describe('useDeletePump (Mutation)', () => {
    it('deletes pump successfully', async () => {
      mockApiClient.delete.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useDeletePump(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.delete).toHaveBeenCalledWith('/pumps/1');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Pump deleted successfully',
      });
    });

    it('handles deletion error', async () => {
      const error = new Error('Failed to delete pump');
      mockApiClient.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeletePump(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to delete pump',
        variant: 'destructive',
      });
    });

    it('handles pump not found during deletion', async () => {
      const notFoundError = new Error('Pump not found');
      notFoundError.name = 'NotFoundError';
      mockApiClient.delete.mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useDeletePump(), { wrapper });

      result.current.mutate('999');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(notFoundError);
    });

    it('handles deletion of pump with dependencies', async () => {
      const dependencyError = new Error('Cannot delete pump with active transactions');
      dependencyError.name = 'DependencyError';
      mockApiClient.delete.mockRejectedValue(dependencyError);

      const { result } = renderHook(() => useDeletePump(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(dependencyError);
    });
  });

  describe('Edge Cases', () => {
    it('handles malformed API responses', async () => {
      mockApiClient.get.mockResolvedValue({ data: null });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('handles API responses with missing fields', async () => {
      const incompletePump = { id: '1', name: 'Incomplete Pump' };
      mockApiClient.get.mockResolvedValue({ data: [incompletePump] });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([incompletePump]);
    });

    it('handles very large datasets', async () => {
      const largePumpList = Array.from({ length: 10000 }, (_, i) => ({
        ...mockPump,
        id: `${i}`,
        name: `Pump ${i}`,
      }));
      mockApiClient.get.mockResolvedValue({ data: largePumpList });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(10000);
    });

    it('handles special characters in pump data', async () => {
      const specialPump = {
        ...mockPump,
        name: 'Pump with <>&"\' characters',
        serialNumber: 'SN-001-🚗⛽',
      };
      mockApiClient.get.mockResolvedValue({ data: [specialPump] });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([specialPump]);
    });

    it('handles component unmounting during API call', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockApiClient.get.mockReturnValue(promise);

      const { result, unmount } = renderHook(() => usePumps(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      // Unmount before API call completes
      unmount();

      // Resolve the promise after unmounting
      resolvePromise!({ data: mockPumps });

      // Should not cause memory leaks or errors
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('handles rapid successive API calls', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPumps });

      const { result, rerender } = renderHook(
        ({ filters }) => usePumps(filters),
        {
          wrapper,
          initialProps: { filters: { stationId: 'station-1' } },
        }
      );

      // Rapidly change filters
      rerender({ filters: { stationId: 'station-2' } });
      rerender({ filters: { stationId: 'station-3' } });
      rerender({ filters: { stationId: 'station-4' } });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should handle rapid changes gracefully
      expect(mockApiClient.get).toHaveBeenCalled();
    });
  });
});
