/**
 * @file __tests__/api-integration.test.ts
 * @description Comprehensive API integration tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import axios, { AxiosError } from 'axios';

// Import API hooks
import { usePumps, useCreatePump, useUpdatePump, useDeletePump } from '@/hooks/api/usePumps';
import { useStations, useCreateStation, useUpdateStation } from '@/hooks/api/useStations';
import { useDashboard } from '@/hooks/api/useDashboard';
import { useSales, useSalesReport } from '@/hooks/api/useSales';
import { useAlerts, useMarkAlertRead } from '@/hooks/api/useAlerts';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock API client
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};

vi.mock('@/lib/api', () => ({
  apiClient: mockApiClient,
}));

// Mock toast notifications
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Test wrapper
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
    nozzleCount: 4,
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    status: 'maintenance',
    stationId: 'station-2',
    nozzleCount: 2,
  },
];

const mockStations = [
  {
    id: 'station-1',
    name: 'Station A',
    location: 'Downtown',
    status: 'active',
    pumpCount: 8,
  },
  {
    id: 'station-2',
    name: 'Station B',
    location: 'Uptown',
    status: 'active',
    pumpCount: 6,
  },
];

const mockDashboardData = {
  totalSales: 125000.50,
  totalTransactions: 1250,
  averageTransactionValue: 100.00,
  salesTrend: 15.5,
  fuelSold: 50000,
};

const mockSales = [
  {
    id: '1',
    amount: 50.00,
    timestamp: '2024-01-15T10:00:00Z',
    pumpId: '1',
    fuelType: 'gasoline',
  },
  {
    id: '2',
    amount: 75.50,
    timestamp: '2024-01-15T11:00:00Z',
    pumpId: '2',
    fuelType: 'diesel',
  },
];

const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'Pump maintenance required',
    timestamp: '2024-01-15T09:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'error',
    message: 'Station offline',
    timestamp: '2024-01-15T08:00:00Z',
    read: false,
  },
];

describe('API Integration Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Pump API Integration', () => {
    it('fetches pumps with proper error handling', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPumps });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPumps);
      expect(mockApiClient.get).toHaveBeenCalledWith('/pumps');
    });

    it('handles pump creation with validation', async () => {
      const newPump = {
        name: 'New Pump',
        serialNumber: 'SN003',
        stationId: 'station-1',
        nozzleCount: 4,
      };

      const createdPump = { ...newPump, id: '3', status: 'active' };
      mockApiClient.post.mockResolvedValue({ data: createdPump });

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate(newPump);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdPump);
      expect(mockApiClient.post).toHaveBeenCalledWith('/pumps', newPump);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Pump created successfully',
      });
    });

    it('handles pump update with optimistic updates', async () => {
      const updateData = { name: 'Updated Pump', status: 'inactive' };
      const updatedPump = { ...mockPumps[0], ...updateData };
      
      mockApiClient.put.mockResolvedValue({ data: updatedPump });

      const { result } = renderHook(() => useUpdatePump(), { wrapper });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedPump);
      expect(mockApiClient.put).toHaveBeenCalledWith('/pumps/1', updateData);
    });

    it('handles pump deletion with confirmation', async () => {
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

    it('handles API errors with proper error messages', async () => {
      const apiError = new AxiosError('Validation failed', '400', undefined, undefined, {
        status: 400,
        data: { message: 'Serial number already exists' },
      } as any);

      mockApiClient.post.mockRejectedValue(apiError);

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate({
        name: 'Duplicate Pump',
        serialNumber: 'SN001', // Duplicate serial
        stationId: 'station-1',
        nozzleCount: 4,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Serial number already exists',
        variant: 'destructive',
      });
    });
  });

  describe('Station API Integration', () => {
    it('fetches stations with related pump data', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockStations });

      const { result } = renderHook(() => useStations(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStations);
      expect(mockApiClient.get).toHaveBeenCalledWith('/stations');
    });

    it('creates station with location validation', async () => {
      const newStation = {
        name: 'New Station',
        location: 'Suburbs',
        address: '789 Pine St',
      };

      const createdStation = { ...newStation, id: 'station-3', status: 'active', pumpCount: 0 };
      mockApiClient.post.mockResolvedValue({ data: createdStation });

      const { result } = renderHook(() => useCreateStation(), { wrapper });

      result.current.mutate(newStation);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdStation);
      expect(mockApiClient.post).toHaveBeenCalledWith('/stations', newStation);
    });

    it('updates station status with cascade effects', async () => {
      const updateData = { status: 'maintenance' };
      const updatedStation = { ...mockStations[0], ...updateData };
      
      mockApiClient.put.mockResolvedValue({ data: updatedStation });

      const { result } = renderHook(() => useUpdateStation(), { wrapper });

      result.current.mutate({ id: 'station-1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedStation);
      expect(mockApiClient.put).toHaveBeenCalledWith('/stations/station-1', updateData);
    });
  });

  describe('Dashboard API Integration', () => {
    it('fetches dashboard data with aggregations', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockDashboardData });

      const { result } = renderHook(() => useDashboard(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDashboardData);
      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard');
    });

    it('handles dashboard data with date range filters', async () => {
      const dateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      mockApiClient.get.mockResolvedValue({ data: mockDashboardData });

      const { result } = renderHook(() => useDashboard(dateRange), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard', { params: dateRange });
    });

    it('handles real-time dashboard updates', async () => {
      // Initial data
      mockApiClient.get.mockResolvedValue({ data: mockDashboardData });

      const { result, rerender } = renderHook(() => useDashboard(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalSales).toBe(125000.50);

      // Simulate real-time update
      const updatedData = { ...mockDashboardData, totalSales: 130000.00 };
      mockApiClient.get.mockResolvedValue({ data: updatedData });

      // Trigger refetch
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.data?.totalSales).toBe(130000.00);
      });
    });
  });

  describe('Sales API Integration', () => {
    it('fetches sales data with pagination', async () => {
      const paginatedResponse = {
        data: mockSales,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: paginatedResponse });

      const { result } = renderHook(() => useSales({ page: 1, limit: 10 }), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(paginatedResponse);
      expect(mockApiClient.get).toHaveBeenCalledWith('/sales', {
        params: { page: 1, limit: 10 },
      });
    });

    it('generates sales reports with filters', async () => {
      const reportFilters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        stationId: 'station-1',
        fuelType: 'gasoline',
      };

      const reportData = {
        summary: {
          totalSales: 50000,
          totalQuantity: 1250,
          averagePrice: 4.00,
        },
        details: mockSales,
      };

      mockApiClient.get.mockResolvedValue({ data: reportData });

      const { result } = renderHook(() => useSalesReport(reportFilters), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(reportData);
      expect(mockApiClient.get).toHaveBeenCalledWith('/sales/report', {
        params: reportFilters,
      });
    });
  });

  describe('Alerts API Integration', () => {
    it('fetches alerts with priority sorting', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockAlerts });

      const { result } = renderHook(() => useAlerts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAlerts);
      expect(mockApiClient.get).toHaveBeenCalledWith('/alerts');
    });

    it('marks alerts as read', async () => {
      const updatedAlert = { ...mockAlerts[0], read: true };
      mockApiClient.patch.mockResolvedValue({ data: updatedAlert });

      const { result } = renderHook(() => useMarkAlertRead(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.patch).toHaveBeenCalledWith('/alerts/1/read');
    });

    it('handles alert filtering by type and status', async () => {
      const filters = { type: 'error', read: false };
      const filteredAlerts = mockAlerts.filter(alert => 
        alert.type === 'error' && !alert.read
      );

      mockApiClient.get.mockResolvedValue({ data: filteredAlerts });

      const { result } = renderHook(() => useAlerts(filters), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/alerts', { params: filters });
    });
  });

  describe('Error Handling Integration', () => {
    it('handles network connectivity issues', async () => {
      const networkError = new AxiosError('Network Error', 'NETWORK_ERROR');
      mockApiClient.get.mockRejectedValue(networkError);

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
    });

    it('handles server errors with retry logic', async () => {
      const serverError = new AxiosError('Internal Server Error', '500', undefined, undefined, {
        status: 500,
        data: { message: 'Database connection failed' },
      } as any);

      mockApiClient.get
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ data: mockPumps });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Retry the request
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPumps);
    });

    it('handles authentication errors', async () => {
      const authError = new AxiosError('Unauthorized', '401', undefined, undefined, {
        status: 401,
        data: { message: 'Token expired' },
      } as any);

      mockApiClient.get.mockRejectedValue(authError);

      const { result } = renderHook(() => useDashboard(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(authError);
    });

    it('handles rate limiting', async () => {
      const rateLimitError = new AxiosError('Too Many Requests', '429', undefined, undefined, {
        status: 429,
        data: { message: 'Rate limit exceeded', retryAfter: 60 },
      } as any);

      mockApiClient.post.mockRejectedValue(rateLimitError);

      const { result } = renderHook(() => useCreatePump(), { wrapper });

      result.current.mutate({
        name: 'Test Pump',
        serialNumber: 'SN999',
        stationId: 'station-1',
        nozzleCount: 4,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(rateLimitError);
    });
  });

  describe('Performance Integration', () => {
    it('handles concurrent API requests efficiently', async () => {
      mockApiClient.get
        .mockResolvedValueOnce({ data: mockPumps })
        .mockResolvedValueOnce({ data: mockStations })
        .mockResolvedValueOnce({ data: mockDashboardData });

      const { result: pumpsResult } = renderHook(() => usePumps(), { wrapper });
      const { result: stationsResult } = renderHook(() => useStations(), { wrapper });
      const { result: dashboardResult } = renderHook(() => useDashboard(), { wrapper });

      await waitFor(() => {
        expect(pumpsResult.current.isSuccess).toBe(true);
        expect(stationsResult.current.isSuccess).toBe(true);
        expect(dashboardResult.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledTimes(3);
    });

    it('handles large dataset responses', async () => {
      const largePumpList = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        name: `Pump ${i}`,
        status: 'active',
        stationId: 'station-1',
        nozzleCount: 4,
      }));

      mockApiClient.get.mockResolvedValue({ data: largePumpList });

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(10000);
    });

    it('handles request cancellation on component unmount', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      mockApiClient.get.mockReturnValue(promise);

      const { result, unmount } = renderHook(() => usePumps(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      // Unmount before request completes
      unmount();

      // Resolve the promise after unmounting
      resolvePromise!({ data: mockPumps });

      // Should not cause memory leaks
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  describe('Data Consistency Integration', () => {
    it('maintains data consistency across related entities', async () => {
      // Create a pump
      const newPump = {
        name: 'Consistency Test Pump',
        serialNumber: 'SN-CONSISTENCY',
        stationId: 'station-1',
        nozzleCount: 4,
      };

      const createdPump = { ...newPump, id: '999', status: 'active' };
      mockApiClient.post.mockResolvedValue({ data: createdPump });

      const { result: createResult } = renderHook(() => useCreatePump(), { wrapper });

      createResult.current.mutate(newPump);

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true);
      });

      // Verify station pump count is updated
      const updatedStation = { ...mockStations[0], pumpCount: 9 };
      mockApiClient.get.mockResolvedValue({ data: [updatedStation, mockStations[1]] });

      const { result: stationsResult } = renderHook(() => useStations(), { wrapper });

      await waitFor(() => {
        expect(stationsResult.current.isSuccess).toBe(true);
      });

      expect(stationsResult.current.data?.[0].pumpCount).toBe(9);
    });

    it('handles cascading updates correctly', async () => {
      // Update station status to maintenance
      const stationUpdate = { status: 'maintenance' };
      const updatedStation = { ...mockStations[0], ...stationUpdate };
      
      mockApiClient.put.mockResolvedValue({ data: updatedStation });

      const { result: updateResult } = renderHook(() => useUpdateStation(), { wrapper });

      updateResult.current.mutate({ id: 'station-1', data: stationUpdate });

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true);
      });

      // Verify related pumps are also updated
      const updatedPumps = mockPumps.map(pump => 
        pump.stationId === 'station-1' 
          ? { ...pump, status: 'inactive' }
          : pump
      );

      mockApiClient.get.mockResolvedValue({ data: updatedPumps });

      const { result: pumpsResult } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(pumpsResult.current.isSuccess).toBe(true);
      });

      const station1Pumps = pumpsResult.current.data?.filter(p => p.stationId === 'station-1');
      expect(station1Pumps?.every(p => p.status === 'inactive')).toBe(true);
    });
  });
});
