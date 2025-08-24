/**
 * @file hooks/api/__tests__/useDashboard.test.ts
 * @description Tests for dashboard-related hooks
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as msw from 'msw';
import { setupServer } from 'msw/node';
import { 
  useSalesSummary, 
  usePaymentMethodBreakdown, 
  useFuelTypeBreakdown, 
  useDailySalesTrend, 
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
  msw.rest.get('/api/dashboard/stats', (req, res, ctx) => {
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
  
  msw.rest.get('/api/dashboard/sales', (req, res, ctx) => {
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
  
  msw.rest.get('/api/dashboard/transactions/recent', (req, res, ctx) => {
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const stationId = req.url.searchParams.get('stationId');
    
    let transactions = [...mockRecentTransactions];
    
    if (stationId) {
      transactions = transactions.filter(txn => txn.pumpId.includes(stationId));
    }
    
    return res(ctx.json(transactions.slice(0, limit)));
  }),
  
  msw.rest.get('/api/dashboard/alerts', (req, res, ctx) => {
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
  
  msw.rest.get('/api/dashboard/stations/:stationId/metrics', (req, res, ctx) => {
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

  return ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('Dashboard Hooks', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  // ...existing code...

  // ...existing code...

  // ...existing code...

  // ...existing code...

  // ...existing code...

  // ...existing code...
});
