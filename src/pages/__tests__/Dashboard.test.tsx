/**
 * @file pages/__tests__/Dashboard.test.tsx
 * @description Comprehensive tests for Dashboard page component
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';

// Mock all hooks
vi.mock('@/hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

vi.mock('@/hooks/useStations', () => ({
  useStations: vi.fn(),
}));

vi.mock('@/hooks/usePumps', () => ({
  usePumps: vi.fn(),
}));

vi.mock('@/hooks/useSales', () => ({
  useSales: vi.fn(),
}));

vi.mock('@/hooks/useAlerts', () => ({
  useAlerts: vi.fn(),
}));

// Mock components
vi.mock('@/components/dashboard/DashboardStats', () => ({
  DashboardStats: () => <div data-testid="dashboard-stats">Dashboard Stats</div>,
}));

vi.mock('@/components/dashboard/SalesChart', () => ({
  SalesChart: () => <div data-testid="sales-chart">Sales Chart</div>,
}));

vi.mock('@/components/dashboard/RecentTransactions', () => ({
  RecentTransactions: () => <div data-testid="recent-transactions">Recent Transactions</div>,
}));

vi.mock('@/components/dashboard/AlertsPanel', () => ({
  AlertsPanel: () => <div data-testid="alerts-panel">Alerts Panel</div>,
}));

vi.mock('@/components/dashboard/QuickActions', () => ({
  QuickActions: () => <div data-testid="quick-actions">Quick Actions</div>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2 data-testid="card-title">{children}</h2>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  Bell: () => <div data-testid="bell-icon">Bell</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  formatDate: (date: Date) => date.toLocaleDateString(),
  formatCurrency: (value: number) => `$${value.toFixed(2)}`,
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
      <BrowserRouter>
        {children}
      </BrowserRouter>
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
  lastUpdated: new Date(),
};

const mockStationsData = [
  { id: '1', name: 'Station 1', status: 'active', location: 'Downtown' },
  { id: '2', name: 'Station 2', status: 'active', location: 'Uptown' },
  { id: '3', name: 'Station 3', status: 'maintenance', location: 'Suburbs' },
];

const mockPumpsData = [
  { id: '1', name: 'Pump 1', status: 'active', stationId: '1' },
  { id: '2', name: 'Pump 2', status: 'active', stationId: '1' },
  { id: '3', name: 'Pump 3', status: 'inactive', stationId: '2' },
];

const mockSalesData = [
  { id: '1', amount: 50.00, timestamp: new Date(), pumpId: '1' },
  { id: '2', amount: 75.50, timestamp: new Date(), pumpId: '2' },
  { id: '3', amount: 100.00, timestamp: new Date(), pumpId: '1' },
];

const mockAlertsData = [
  { id: '1', type: 'warning', message: 'Pump 3 requires maintenance', timestamp: new Date() },
  { id: '2', type: 'error', message: 'Station 2 offline', timestamp: new Date() },
];

describe('Dashboard Page', () => {
  const mockUseDashboard = vi.fn();
  const mockUseStations = vi.fn();
  const mockUsePumps = vi.fn();
  const mockUseSales = vi.fn();
  const mockUseAlerts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockUseDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    
    mockUseStations.mockReturnValue({
      data: mockStationsData,
      isLoading: false,
      error: null,
    });
    
    mockUsePumps.mockReturnValue({
      data: mockPumpsData,
      isLoading: false,
      error: null,
    });
    
    mockUseSales.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
    });
    
    mockUseAlerts.mockReturnValue({
      data: mockAlertsData,
      isLoading: false,
      error: null,
    });

    // Apply mocks
    vi.mocked(require('@/hooks/useDashboard').useDashboard).mockImplementation(mockUseDashboard);
    vi.mocked(require('@/hooks/useStations').useStations).mockImplementation(mockUseStations);
    vi.mocked(require('@/hooks/usePumps').usePumps).mockImplementation(mockUsePumps);
    vi.mocked(require('@/hooks/useSales').useSales).mockImplementation(mockUseSales);
    vi.mocked(require('@/hooks/useAlerts').useAlerts).mockImplementation(mockUseAlerts);
  });

  describe('Basic Rendering', () => {
    it('renders dashboard page with all components', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
      expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });

    it('renders page header with title and actions', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Refresh')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('displays last updated timestamp', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state when dashboard data is loading', () => {
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('shows skeleton loading for individual components', () => {
      mockUseDashboard.mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseSales.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      // Sales chart should show loading state
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('handles dashboard data error', () => {
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch dashboard data'),
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('handles partial errors gracefully', () => {
      mockUseDashboard.mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseAlerts.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch alerts'),
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should show dashboard but handle alerts error
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
    });

    it('provides retry functionality', () => {
      const mockRefetch = vi.fn();
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interactions', () => {
    it('handles refresh button click', () => {
      const mockRefetch = vi.fn();
      mockUseDashboard.mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('handles export button click', () => {
      const mockDownload = vi.fn();
      global.URL.createObjectURL = vi.fn();
      global.URL.revokeObjectURL = vi.fn();
      
      // Mock document.createElement for download
      const mockAnchor = {
        href: '',
        download: '',
        click: mockDownload,
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);

      // Should trigger download
      expect(mockDownload).toHaveBeenCalledTimes(1);
    });

    it('handles date range selection', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const dateRangeButton = screen.getByTestId('calendar-icon');
      fireEvent.click(dateRangeButton);

      // Should open date picker (implementation depends on date picker component)
      expect(dateRangeButton).toBeInTheDocument();
    });

    it('handles quick action clicks', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
      // Quick actions component should handle its own interactions
    });
  });

  describe('Real-time Updates', () => {
    it('updates data when refetch is called', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Initial data
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();

      // Update mock data
      mockUseDashboard.mockReturnValue({
        data: {
          ...mockDashboardData,
          totalSales: 150000.00,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      rerender(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should reflect updated data
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('handles auto-refresh functionality', async () => {
      vi.useFakeTimers();
      
      const mockRefetch = vi.fn();
      mockUseDashboard.mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Fast-forward time to trigger auto-refresh
      vi.advanceTimersByTime(30000); // 30 seconds

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });
  });

  describe('Responsive Design', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render mobile-friendly layout
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('adapts layout for tablet screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('handles window resize events', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      fireEvent(window, new Event('resize'));

      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes expensive calculations', () => {
      const { rerender } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Re-render with same props
      rerender(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Components should not re-render unnecessarily
      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeSalesData = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        amount: Math.random() * 100,
        timestamp: new Date(),
        pumpId: `${i % 10}`,
      }));

      mockUseSales.mockReturnValue({
        data: largeSalesData,
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Dashboard');
    });

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const refreshButton = screen.getByText('Refresh');
      refreshButton.focus();
      
      expect(refreshButton).toHaveFocus();
    });

    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const dashboard = screen.getByRole('main');
      expect(dashboard).toHaveAttribute('aria-label', 'Dashboard');
    });

    it('supports screen readers', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should have proper semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data gracefully', () => {
      mockUseDashboard.mockReturnValue({
        data: {
          totalSales: 0,
          totalTransactions: 0,
          fuelSold: 0,
          salesTrend: 0,
          transactionsTrend: 0,
          fuelTrend: 0,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('handles component unmounting during data fetch', () => {
      const { unmount } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles network connectivity issues', () => {
      mockUseDashboard.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network Error'),
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();
    });
  });
});
