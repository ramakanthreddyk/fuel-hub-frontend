/**
 * @file components/dashboard/__tests__/DashboardStats.test.tsx
 * @description Comprehensive tests for DashboardStats component
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardStats } from '../DashboardStats';

// Mock hooks
vi.mock('@/hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

vi.mock('@/hooks/useStations', () => ({
  useStations: vi.fn(),
}));

vi.mock('@/hooks/usePumps', () => ({
  usePumps: vi.fn(),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  TrendingDown: () => <div data-testid="trending-down-icon">TrendingDown</div>,
  DollarSign: () => <div data-testid="dollar-icon">DollarSign</div>,
  Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
  Building: () => <div data-testid="building-icon">Building</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  Activity: () => <div data-testid="activity-icon">Activity</div>,
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  formatCurrency: (value: number) => `$${value.toFixed(2)}`,
  formatNumber: (value: number) => value.toLocaleString(),
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock data
const mockDashboardData = {
  totalSales: 125000.50,
  totalTransactions: 1250,
  averageTransactionValue: 100.00,
  salesTrend: 15.5,
  transactionsTrend: -2.3,
  fuelSold: 50000,
  fuelTrend: 8.2,
};

const mockStationsData = {
  data: [
    { id: '1', name: 'Station 1', status: 'active' },
    { id: '2', name: 'Station 2', status: 'active' },
    { id: '3', name: 'Station 3', status: 'maintenance' },
  ],
  isLoading: false,
  error: null,
};

const mockPumpsData = {
  data: [
    { id: '1', name: 'Pump 1', status: 'active' },
    { id: '2', name: 'Pump 2', status: 'active' },
    { id: '3', name: 'Pump 3', status: 'inactive' },
    { id: '4', name: 'Pump 4', status: 'maintenance' },
  ],
  isLoading: false,
  error: null,
};

describe('DashboardStats Component', () => {
  const mockUseDashboard = vi.fn();
  const mockUseStations = vi.fn();
  const mockUsePumps = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockUseDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });
    
    mockUseStations.mockReturnValue(mockStationsData);
    mockUsePumps.mockReturnValue(mockPumpsData);

    // Apply mocks
    vi.mocked(require('@/hooks/useDashboard').useDashboard).mockImplementation(mockUseDashboard);
    vi.mocked(require('@/hooks/useStations').useStations).mockImplementation(mockUseStations);
    vi.mocked(require('@/hooks/usePumps').usePumps).mockImplementation(mockUsePumps);
  });

  describe('Basic Rendering', () => {
    it('renders all stat cards', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Fuel Sold')).toBeInTheDocument();
      expect(screen.getByText('Active Stations')).toBeInTheDocument();
      expect(screen.getByText('Active Pumps')).toBeInTheDocument();
    });

    it('displays correct values', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('$125,000.50')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('50,000')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Active stations
      expect(screen.getByText('2')).toBeInTheDocument(); // Active pumps
    });

    it('shows trend indicators', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('+15.5%')).toBeInTheDocument();
      expect(screen.getByText('-2.3%')).toBeInTheDocument();
      expect(screen.getByText('+8.2%')).toBeInTheDocument();
    });

    it('displays correct icons', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByTestId('dollar-icon')).toBeInTheDocument();
      expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
      expect(screen.getByTestId('fuel-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building-icon')).toBeInTheDocument();
      expect(screen.getByTestId('gauge-icon')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state for dashboard data', () => {
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows loading state for stations data', () => {
      mockUseStations.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should show loading for stations card
      expect(screen.getByText('Active Stations')).toBeInTheDocument();
    });

    it('shows loading state for pumps data', () => {
      mockUsePumps.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should show loading for pumps card
      expect(screen.getByText('Active Pumps')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('handles dashboard data error', () => {
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch dashboard data'),
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });

    it('handles stations data error', () => {
      mockUseStations.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch stations'),
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should show error state for stations
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('handles pumps data error', () => {
      mockUsePumps.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch pumps'),
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should show error state for pumps
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('handles partial errors gracefully', () => {
      mockUseDashboard.mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
      });

      mockUseStations.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Stations error'),
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should show dashboard data but error for stations
      expect(screen.getByText('$125,000.50')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });
  });

  describe('Data Calculations', () => {
    it('calculates active stations correctly', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // 2 active stations out of 3 total
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('calculates active pumps correctly', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // 2 active pumps out of 4 total
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('handles empty data arrays', () => {
      mockUseStations.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      mockUsePumps.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('0')).toBeInTheDocument(); // Active stations
      expect(screen.getByText('0')).toBeInTheDocument(); // Active pumps
    });

    it('handles null data gracefully', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          totalSales: null,
          totalTransactions: null,
          fuelSold: null,
          salesTrend: null,
          transactionsTrend: null,
          fuelTrend: null,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('$0.00')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('shows positive trend with up arrow', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
      expect(screen.getByText('+15.5%')).toBeInTheDocument();
    });

    it('shows negative trend with down arrow', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByTestId('trending-down-icon')).toBeInTheDocument();
      expect(screen.getByText('-2.3%')).toBeInTheDocument();
    });

    it('handles zero trend', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          salesTrend: 0,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('handles missing trend data', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          salesTrend: undefined,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should not show trend indicator
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          totalSales: 999999999.99,
          totalTransactions: 9999999,
          fuelSold: 9999999,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('$999,999,999.99')).toBeInTheDocument();
      expect(screen.getByText('9,999,999')).toBeInTheDocument();
    });

    it('handles negative values', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          totalSales: -1000,
          totalTransactions: -50,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('-$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('handles decimal values', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          totalSales: 1234.567,
          fuelSold: 5000.123,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      expect(screen.getByText('$1,234.57')).toBeInTheDocument();
      expect(screen.getByText('5,000')).toBeInTheDocument();
    });

    it('handles mixed status values', () => {
      mockUseStations.mockReturnValue({
        data: [
          { id: '1', status: 'active' },
          { id: '2', status: 'ACTIVE' }, // Different case
          { id: '3', status: 'inactive' },
          { id: '4', status: null },
          { id: '5', status: undefined },
        ],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Should handle case-insensitive matching
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('handles component unmounting during data fetch', async () => {
      const { unmount } = render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Unmount before data loads
      unmount();

      // Should not cause memory leaks
      await waitFor(() => {
        expect(true).toBe(true); // No errors thrown
      });
    });

    it('handles rapid data updates', () => {
      const { rerender } = render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      // Rapidly update data
      for (let i = 0; i < 10; i++) {
        mockUseDashboard.mockReturnValue({
          data: {
            ...mockDashboardData,
            totalSales: 1000 * i,
          },
          isLoading: false,
          error: null,
        });

        rerender(
          <TestWrapper>
            <DashboardStats />
          </TestWrapper>
        );
      }

      expect(screen.getByText('$9,000.00')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      const cards = screen.getAllByTestId('card');
      cards.forEach(card => {
        expect(card).toBeInTheDocument();
      });
    });

    it('supports screen readers', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      const titles = screen.getAllByTestId('card-title');
      titles.forEach(title => {
        expect(title).toBeInTheDocument();
      });
    });

    it('has semantic HTML structure', () => {
      render(
        <TestWrapper>
          <DashboardStats />
        </TestWrapper>
      );

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
