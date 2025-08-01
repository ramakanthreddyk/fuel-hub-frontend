/**
 * @file __tests__/api/hookIntegration.test.tsx
 * @description Integration tests for API hooks
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { usePumps, useCreatePump, useUpdatePump, useDeletePump } from '@/hooks/api/usePumps';
import { useStations, useCreateStation } from '@/hooks/api/useStations';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useDashboardStats, useSalesData } from '@/hooks/api/useDashboard';

// Mock data
const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    status: 'active',
    nozzleCount: 4,
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    status: 'maintenance',
    nozzleCount: 2,
  },
];

const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
  },
];

const mockNozzles = [
  {
    id: '1',
    name: 'Nozzle 1A',
    pumpId: '1',
    fuelType: 'gasoline',
    status: 'active',
  },
];

const mockDashboardStats = {
  totalSales: 125000,
  totalTransactions: 1250,
  activePumps: 12,
  totalStations: 3,
};

const mockSalesData = [
  { date: '2024-01-01', sales: 12000 },
  { date: '2024-01-02', sales: 13500 },
  { date: '2024-01-03', sales: 11800 },
];

// MSW server setup
const server = setupServer(
  rest.get('/api/pumps', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const stationId = req.url.searchParams.get('stationId');
    
    let filteredPumps = [...mockPumps];
    if (status) {
      filteredPumps = filteredPumps.filter(pump => pump.status === status);
    }
    if (stationId) {
      filteredPumps = filteredPumps.filter(pump => pump.stationId === stationId);
    }
    
    return res(ctx.json(filteredPumps));
  }),
  
  rest.post('/api/pumps', async (req, res, ctx) => {
    const pumpData = await req.json();
    const newPump = { id: '3', ...pumpData, status: 'active' };
    return res(ctx.status(201), ctx.json(newPump));
  }),
  
  rest.put('/api/pumps/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const pump = mockPumps.find(p => p.id === id);
    return res(ctx.json({ ...pump, ...updateData }));
  }),
  
  rest.delete('/api/pumps/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  
  rest.get('/api/stations', (req, res, ctx) => {
    return res(ctx.json(mockStations));
  }),
  
  rest.post('/api/stations', async (req, res, ctx) => {
    const stationData = await req.json();
    const newStation = { id: 'station-2', ...stationData };
    return res(ctx.status(201), ctx.json(newStation));
  }),
  
  rest.get('/api/nozzles', (req, res, ctx) => {
    const pumpId = req.url.searchParams.get('pumpId');
    let filteredNozzles = [...mockNozzles];
    if (pumpId) {
      filteredNozzles = filteredNozzles.filter(n => n.pumpId === pumpId);
    }
    return res(ctx.json(filteredNozzles));
  }),
  
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json(mockDashboardStats));
  }),
  
  rest.get('/api/dashboard/sales', (req, res, ctx) => {
    return res(ctx.json(mockSalesData));
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('API Hooks Integration', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('usePumps hook', () => {
    it('should fetch pumps successfully', async () => {
      const { result } = renderHook(() => usePumps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPumps);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should filter pumps by status', async () => {
      const { result } = renderHook(() => usePumps({ status: 'active' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].status).toBe('active');
    });

    it('should filter pumps by station', async () => {
      const { result } = renderHook(() => usePumps({ stationId: 'station-1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.every(pump => pump.stationId === 'station-1')).toBe(true);
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      const { result } = renderHook(() => usePumps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should refetch data when called', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockPumps));
        })
      );

      const { result } = renderHook(() => usePumps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiSpy).toHaveBeenCalledTimes(1);

      // Trigger refetch
      result.current.refetch();

      await waitFor(() => {
        expect(apiSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useCreatePump hook', () => {
    it('should create pump successfully', async () => {
      const { result } = renderHook(() => useCreatePump(), {
        wrapper: createWrapper(),
      });

      const newPumpData = {
        name: 'New Pump',
        serialNumber: 'SN003',
        stationId: 'station-1',
        nozzleCount: 4,
      };

      result.current.mutate(newPumpData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        id: '3',
        ...newPumpData,
        status: 'active',
      });
    });

    it('should handle creation errors', async () => {
      server.use(
        rest.post('/api/pumps', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'Validation error' }));
        })
      );

      const { result } = renderHook(() => useCreatePump(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: '',
        serialNumber: '',
        stationId: '',
        nozzleCount: 0,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCreatePump({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: 'New Pump',
        serialNumber: 'SN003',
        stationId: 'station-1',
        nozzleCount: 4,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(result.current.data);
    });
  });

  describe('useUpdatePump hook', () => {
    it('should update pump successfully', async () => {
      const { result } = renderHook(() => useUpdatePump(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        id: '1',
        name: 'Updated Pump 1',
        status: 'maintenance',
      };

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Updated Pump 1');
      expect(result.current.data?.status).toBe('maintenance');
    });

    it('should handle update errors', async () => {
      server.use(
        rest.put('/api/pumps/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: 'Pump not found' }));
        })
      );

      const { result } = renderHook(() => useUpdatePump(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '999', name: 'Non-existent' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeletePump hook', () => {
    it('should delete pump successfully', async () => {
      const { result } = renderHook(() => useDeletePump(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle deletion errors', async () => {
      server.use(
        rest.delete('/api/pumps/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'Cannot delete active pump' }));
        })
      );

      const { result } = renderHook(() => useDeletePump(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useStations hook', () => {
    it('should fetch stations successfully', async () => {
      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStations);
    });

    it('should handle stations API errors', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useCreateStation hook', () => {
    it('should create station successfully', async () => {
      const { result } = renderHook(() => useCreateStation(), {
        wrapper: createWrapper(),
      });

      const newStationData = {
        name: 'New Station',
        address: '456 New St',
        city: 'New City',
        state: 'NC',
        zipCode: '12345',
      };

      result.current.mutate(newStationData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        id: 'station-2',
        ...newStationData,
      });
    });
  });

  describe('useNozzles hook', () => {
    it('should fetch nozzles successfully', async () => {
      const { result } = renderHook(() => useNozzles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockNozzles);
    });

    it('should filter nozzles by pump', async () => {
      const { result } = renderHook(() => useNozzles({ pumpId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].pumpId).toBe('1');
    });
  });

  describe('useDashboardStats hook', () => {
    it('should fetch dashboard stats successfully', async () => {
      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDashboardStats);
    });

    it('should handle dashboard stats errors', async () => {
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useSalesData hook', () => {
    it('should fetch sales data successfully', async () => {
      const { result } = renderHook(() => useSalesData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSalesData);
    });

    it('should fetch sales data with date range', async () => {
      const { result } = renderHook(() => useSalesData({ range: 'month' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSalesData);
    });
  });

  describe('Hook caching and invalidation', () => {
    it('should cache query results', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockPumps));
        })
      );

      const wrapper = createWrapper();

      // First hook instance
      const { result: result1 } = renderHook(() => usePumps(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second hook instance should use cached data
      const { result: result2 } = renderHook(() => usePumps(), { wrapper });
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Should only make one API call due to caching
      expect(apiSpy).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache after mutations', async () => {
      const wrapper = createWrapper();

      // Fetch initial data
      const { result: queryResult } = renderHook(() => usePumps(), { wrapper });
      await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

      // Create new pump
      const { result: mutationResult } = renderHook(() => useCreatePump(), { wrapper });
      mutationResult.current.mutate({
        name: 'New Pump',
        serialNumber: 'SN003',
        stationId: 'station-1',
        nozzleCount: 4,
      });

      await waitFor(() => expect(mutationResult.current.isSuccess).toBe(true));

      // Query should be invalidated and refetched
      await waitFor(() => {
        expect(queryResult.current.isFetching).toBe(true);
      });
    });
  });

  describe('Error recovery', () => {
    it('should retry failed requests', async () => {
      let callCount = 0;
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          callCount++;
          if (callCount === 1) {
            return res(ctx.status(500), ctx.json({ error: 'Server error' }));
          }
          return res(ctx.json(mockPumps));
        })
      );

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: 1, retryDelay: 0 },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => usePumps(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(callCount).toBe(2); // Initial call + 1 retry
      expect(result.current.data).toEqual(mockPumps);
    });

    it('should handle network errors gracefully', async () => {
      server.use(
        rest.get('/api/pumps', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      const { result } = renderHook(() => usePumps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('Optimistic updates', () => {
    it('should perform optimistic updates for mutations', async () => {
      const wrapper = createWrapper();

      // Fetch initial data
      const { result: queryResult } = renderHook(() => usePumps(), { wrapper });
      await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

      const initialData = queryResult.current.data;

      // Update pump with optimistic update
      const { result: mutationResult } = renderHook(() => useUpdatePump({
        onMutate: async (variables) => {
          // Cancel outgoing refetches
          await queryResult.current.refetch();
          
          // Snapshot previous value
          const previousData = queryResult.current.data;
          
          // Optimistically update
          const optimisticData = previousData?.map(pump =>
            pump.id === variables.id ? { ...pump, ...variables } : pump
          );
          
          return { previousData, optimisticData };
        },
      }), { wrapper });

      mutationResult.current.mutate({
        id: '1',
        name: 'Optimistically Updated Pump',
      });

      // Should immediately show optimistic update
      expect(queryResult.current.data?.[0].name).toBe('Optimistically Updated Pump');

      await waitFor(() => {
        expect(mutationResult.current.isSuccess).toBe(true);
      });
    });
  });
});
