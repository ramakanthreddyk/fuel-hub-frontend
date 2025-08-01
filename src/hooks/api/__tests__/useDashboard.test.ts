/**
 * @file hooks/api/__tests__/useDashboard.test.ts
 * @description Tests for dashboard-related hooks
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { 
  useDashboardStats, 
  useSalesData, 
  useRecentTransactions, 
  useAlerts,
  useStationMetrics 
} from '../useDashboard';

// Mock data
const mockDashboardStats = {
  totalSales: 125000,
  totalTransactions: 1250,
  activePumps: 12,
  totalStations: 3,
  todaySales: 15000,
  yesterdaySales: 12000,
  salesGrowth: 12.5,
  averageTransaction: 100,
  efficiency: 87.5,
};

const mockSalesData = [
  { date: '2024-01-01', sales: 12000, transactions: 120 },
  { date: '2024-01-02', sales: 13500, transactions: 135 },
  { date: '2024-01-03', sales: 11800, transactions: 118 },
  { date: '2024-01-04', sales: 14200, transactions: 142 },
  { date: '2024-01-05', sales: 15000, transactions: 150 },
];

const mockRecentTransactions = [
  {
    id: 'txn-1',
    amount: 45.50,
    pumpId: 'pump-1',
    pumpName: 'Pump 1',
    fuelType: 'petrol',
    quantity: 5.5,
    timestamp: '2024-01-01T10:30:00Z',
    paymentMethod: 'card',
  },
  {
    id: 'txn-2',
    amount: 67.25,
    pumpId: 'pump-3',
    pumpName: 'Pump 3',
    fuelType: 'diesel',
    quantity: 7.5,
    timestamp: '2024-01-01T10:25:00Z',
    paymentMethod: 'cash',
  },
];

const mockAlerts = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Maintenance Required',
    message: 'Pump 2 requires maintenance',
    timestamp: '2024-01-01T09:00:00Z',
    severity: 'medium',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'Sales Target',
    message: 'Daily sales target achieved',
    timestamp: '2024-01-01T08:00:00Z',
    severity: 'low',
    acknowledged: true,
  },
];

const mockStationMetrics = {
  stationId: 'station-1',
  todaySales: 25000,
  todayTransactions: 150,
  activePumps: 7,
  totalPumps: 8,
  efficiency: 87.5,
  fuelSold: {
    petrol: 1200,
    diesel: 800,
    premium: 300,
  },
  hourlyData: [
    { hour: '08:00', sales: 1200, transactions: 12 },
    { hour: '09:00', sales: 1500, transactions: 15 },
    { hour: '10:00', sales: 1800, transactions: 18 },
  ],
};

// MSW server setup
const server = setupServer(
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    const stationId = req.url.searchParams.get('stationId');
    const dateRange = req.url.searchParams.get('dateRange');
    
    let stats = { ...mockDashboardStats };
    
    if (stationId) {
      stats = { ...stats, totalStations: 1 };
    }
    
    if (dateRange === 'week') {
      stats = { ...stats, totalSales: stats.totalSales * 7 };
    }
    
    return res(ctx.json(stats));
  }),
  
  rest.get('/api/dashboard/sales', (req, res, ctx) => {
    const range = req.url.searchParams.get('range');
    const stationId = req.url.searchParams.get('stationId');
    
    let salesData = [...mockSalesData];
    
    if (range === 'week') {
      salesData = salesData.slice(-7);
    } else if (range === 'month') {
      salesData = salesData.slice(-30);
    }
    
    if (stationId) {
      salesData = salesData.map(item => ({ ...item, sales: item.sales * 0.3 }));
    }
    
    return res(ctx.json(salesData));
  }),
  
  rest.get('/api/dashboard/transactions/recent', (req, res, ctx) => {
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const stationId = req.url.searchParams.get('stationId');
    
    let transactions = [...mockRecentTransactions];
    
    if (stationId) {
      transactions = transactions.filter(txn => txn.pumpId.includes(stationId));
    }
    
    return res(ctx.json(transactions.slice(0, limit)));
  }),
  
  rest.get('/api/dashboard/alerts', (req, res, ctx) => {
    const acknowledged = req.url.searchParams.get('acknowledged');
    const severity = req.url.searchParams.get('severity');
    
    let alerts = [...mockAlerts];
    
    if (acknowledged !== null) {
      alerts = alerts.filter(alert => alert.acknowledged === (acknowledged === 'true'));
    }
    
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }
    
    return res(ctx.json(alerts));
  }),
  
  rest.get('/api/dashboard/stations/:stationId/metrics', (req, res, ctx) => {
    const { stationId } = req.params;
    
    return res(ctx.json({ ...mockStationMetrics, stationId }));
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

describe('Dashboard Hooks', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
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
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should filter stats by station', async () => {
      const { result } = renderHook(() => useDashboardStats({ stationId: 'station-1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalStations).toBe(1);
    });

    it('should filter stats by date range', async () => {
      const { result } = renderHook(() => useDashboardStats({ dateRange: 'week' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalSales).toBe(mockDashboardStats.totalSales * 7);
    });

    it('should handle API errors', async () => {
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

      expect(result.current.error).toBeDefined();
    });

    it('should refetch data when called', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockDashboardStats));
        })
      );

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiSpy).toHaveBeenCalledTimes(1);

      result.current.refetch();

      await waitFor(() => {
        expect(apiSpy).toHaveBeenCalledTimes(2);
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

    it('should filter sales data by range', async () => {
      const { result } = renderHook(() => useSalesData({ range: 'week' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(5); // Last 7 days, but we only have 5 items
    });

    it('should filter sales data by station', async () => {
      const { result } = renderHook(() => useSalesData({ stationId: 'station-1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Sales should be reduced for specific station
      expect(result.current.data?.[0].sales).toBe(mockSalesData[0].sales * 0.3);
    });

    it('should handle empty sales data', async () => {
      server.use(
        rest.get('/api/dashboard/sales', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      const { result } = renderHook(() => useSalesData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useRecentTransactions hook', () => {
    it('should fetch recent transactions successfully', async () => {
      const { result } = renderHook(() => useRecentTransactions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRecentTransactions);
    });

    it('should limit number of transactions', async () => {
      const { result } = renderHook(() => useRecentTransactions({ limit: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
    });

    it('should filter transactions by station', async () => {
      const { result } = renderHook(() => useRecentTransactions({ stationId: 'station-1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should filter based on pump ID containing station ID
      expect(result.current.data?.every(txn => txn.pumpId.includes('station-1'))).toBe(true);
    });

    it('should handle no transactions', async () => {
      server.use(
        rest.get('/api/dashboard/transactions/recent', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      const { result } = renderHook(() => useRecentTransactions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useAlerts hook', () => {
    it('should fetch alerts successfully', async () => {
      const { result } = renderHook(() => useAlerts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAlerts);
    });

    it('should filter alerts by acknowledged status', async () => {
      const { result } = renderHook(() => useAlerts({ acknowledged: false }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.every(alert => !alert.acknowledged)).toBe(true);
    });

    it('should filter alerts by severity', async () => {
      const { result } = renderHook(() => useAlerts({ severity: 'medium' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.every(alert => alert.severity === 'medium')).toBe(true);
    });

    it('should handle no alerts', async () => {
      server.use(
        rest.get('/api/dashboard/alerts', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      const { result } = renderHook(() => useAlerts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useStationMetrics hook', () => {
    it('should fetch station metrics successfully', async () => {
      const { result } = renderHook(() => useStationMetrics('station-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        ...mockStationMetrics,
        stationId: 'station-1',
      });
    });

    it('should not fetch when station ID is not provided', () => {
      const { result } = renderHook(() => useStationMetrics(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle station not found', async () => {
      server.use(
        rest.get('/api/dashboard/stations/:stationId/metrics', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
        })
      );

      const { result } = renderHook(() => useStationMetrics('non-existent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('caching and real-time updates', () => {
    it('should cache dashboard stats', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockDashboardStats));
        })
      );

      const wrapper = createWrapper();

      // First hook instance
      const { result: result1 } = renderHook(() => useDashboardStats(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second hook instance should use cached data
      const { result: result2 } = renderHook(() => useDashboardStats(), { wrapper });
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Should only make one API call due to caching
      expect(apiSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle real-time data updates', async () => {
      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalSales).toBe(125000);

      // Simulate real-time update
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.json({ ...mockDashboardStats, totalSales: 130000 }));
        })
      );

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.data?.totalSales).toBe(130000);
      });
    });

    it('should handle concurrent requests efficiently', async () => {
      const wrapper = createWrapper();

      // Make multiple concurrent requests
      const hooks = [
        renderHook(() => useDashboardStats(), { wrapper }),
        renderHook(() => useSalesData(), { wrapper }),
        renderHook(() => useRecentTransactions(), { wrapper }),
        renderHook(() => useAlerts(), { wrapper }),
      ];

      await Promise.all(
        hooks.map(({ result }) => 
          waitFor(() => expect(result.current.isSuccess).toBe(true))
        )
      );

      // All should have their respective data
      expect(hooks[0].result.current.data).toEqual(mockDashboardStats);
      expect(hooks[1].result.current.data).toEqual(mockSalesData);
      expect(hooks[2].result.current.data).toEqual(mockRecentTransactions);
      expect(hooks[3].result.current.data).toEqual(mockAlerts);
    });
  });
});
