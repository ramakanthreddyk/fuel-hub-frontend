/**
 * @file pages/__tests__/DashboardPage.test.tsx
 * @description Tests for the Dashboard page component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../dashboard/DashboardPage';

// Mock the dashboard components
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

// Mock API hooks
vi.mock('@/hooks/api/useDashboard', () => ({
  useDashboardStats: () => ({
    data: {
      totalSales: 15000,
      totalTransactions: 245,
      averageTransaction: 61.22,
      activePumps: 8,
    },
    isLoading: false,
    error: null,
  }),
  useSalesData: () => ({
    data: [
      { date: '2024-01-01', sales: 1200 },
      { date: '2024-01-02', sales: 1350 },
      { date: '2024-01-03', sales: 1100 },
    ],
    isLoading: false,
    error: null,
  }),
  useRecentTransactions: () => ({
    data: [
      { id: '1', amount: 45.50, pump: 'Pump 1', time: '10:30 AM' },
      { id: '2', amount: 67.25, pump: 'Pump 3', time: '10:25 AM' },
    ],
    isLoading: false,
    error: null,
  }),
  useAlerts: () => ({
    data: [
      { id: '1', type: 'warning', message: 'Pump 2 needs maintenance' },
      { id: '2', type: 'info', message: 'Daily report ready' },
    ],
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display the page title', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('should render all dashboard components', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
        expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
        expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
      });
    });

    it('should have proper accessibility attributes', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('aria-label', 'Dashboard');
    });
  });

  describe('when loading', () => {
    it('should show loading states', () => {
      // Mock loading state
      vi.doMock('@/hooks/api/useDashboard', () => ({
        useDashboardStats: () => ({ data: null, isLoading: true, error: null }),
        useSalesData: () => ({ data: null, isLoading: true, error: null }),
        useRecentTransactions: () => ({ data: null, isLoading: true, error: null }),
        useAlerts: () => ({ data: null, isLoading: true, error: null }),
      }));

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      // Should show loading indicators
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('when there are errors', () => {
    it('should display error messages', () => {
      // Mock error state
      vi.doMock('@/hooks/api/useDashboard', () => ({
        useDashboardStats: () => ({ 
          data: null, 
          isLoading: false, 
          error: new Error('Failed to load stats') 
        }),
        useSalesData: () => ({ data: null, isLoading: false, error: null }),
        useRecentTransactions: () => ({ data: null, isLoading: false, error: null }),
        useAlerts: () => ({ data: null, isLoading: false, error: null }),
      }));

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  describe('when user interacts', () => {
    it('should handle refresh action', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      // Should trigger data refetch
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });
    });

    it('should handle date range selection', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const dateRangeSelect = screen.getByRole('combobox', { name: /date range/i });
      fireEvent.change(dateRangeSelect, { target: { value: 'last-week' } });
      
      await waitFor(() => {
        expect(dateRangeSelect).toHaveValue('last-week');
      });
    });

    it('should navigate to detailed views', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
      fireEvent.click(viewDetailsButton);
      
      // Should navigate to appropriate page
      await waitFor(() => {
        expect(window.location.pathname).toBe('/reports');
      });
    });
  });

  describe('responsive behavior', () => {
    it('should adapt layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('mobile-layout');
    });

    it('should show full layout for desktop screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('desktop-layout');
    });
  });

  describe('performance', () => {
    it('should render within acceptable time', async () => {
      const startTime = performance.now();
      
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(1000); // Should render within 1 second
    });

    it('should not cause memory leaks', () => {
      const { unmount } = render(<DashboardPage />, { wrapper: createWrapper() });
      
      // Unmount component
      unmount();
      
      // Check that no timers or listeners are left
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveAttribute('aria-level', '1');
      expect(headings[1]).toHaveAttribute('aria-level', '2');
    });

    it('should support keyboard navigation', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const firstFocusable = screen.getByRole('button', { name: /refresh/i });
      firstFocusable.focus();
      
      expect(document.activeElement).toBe(firstFocusable);
      
      // Tab to next element
      fireEvent.keyDown(firstFocusable, { key: 'Tab' });
      
      const nextFocusable = screen.getByRole('combobox', { name: /date range/i });
      expect(document.activeElement).toBe(nextFocusable);
    });

    it('should announce updates to screen readers', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      // Trigger an update
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/dashboard updated/i);
      });
    });
  });

  describe('data integration', () => {
    it('should handle empty data gracefully', () => {
      // Mock empty data
      vi.doMock('@/hooks/api/useDashboard', () => ({
        useDashboardStats: () => ({ data: null, isLoading: false, error: null }),
        useSalesData: () => ({ data: [], isLoading: false, error: null }),
        useRecentTransactions: () => ({ data: [], isLoading: false, error: null }),
        useAlerts: () => ({ data: [], isLoading: false, error: null }),
      }));

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    it('should format data correctly', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      // Check that currency is formatted
      expect(screen.getByText(/\$15,000/)).toBeInTheDocument();
      
      // Check that numbers are formatted
      expect(screen.getByText(/245/)).toBeInTheDocument();
    });
  });

  describe('real-time updates', () => {
    it('should update data automatically', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });
      
      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });
      
      // Simulate real-time update
      vi.advanceTimersByTime(30000); // 30 seconds
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });
    });

    it('should handle connection issues gracefully', async () => {
      // Mock network error
      vi.doMock('@/hooks/api/useDashboard', () => ({
        useDashboardStats: () => ({ 
          data: null, 
          isLoading: false, 
          error: new Error('Network error') 
        }),
      }));

      render(<DashboardPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/connection issue/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
