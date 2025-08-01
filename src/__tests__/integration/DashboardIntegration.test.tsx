/**
 * @file __tests__/integration/DashboardIntegration.test.tsx
 * @description Integration tests for dashboard components working together
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import DashboardPage from '@/pages/dashboard/DashboardPage';

// Mock data
const mockDashboardData = {
  stats: {
    totalSales: 125000,
    totalTransactions: 1250,
    averageTransaction: 100,
    activePumps: 12,
    totalStations: 3,
    fuelInventory: 85000,
  },
  salesData: [
    { date: '2024-01-01', sales: 12000, transactions: 120 },
    { date: '2024-01-02', sales: 13500, transactions: 135 },
    { date: '2024-01-03', sales: 11800, transactions: 118 },
    { date: '2024-01-04', sales: 14200, transactions: 142 },
    { date: '2024-01-05', sales: 13000, transactions: 130 },
  ],
  recentTransactions: [
    {
      id: '1',
      amount: 45.50,
      pump: 'Pump 1',
      station: 'Main Station',
      time: '10:30 AM',
      fuelType: 'gasoline',
      volume: 12.5,
    },
    {
      id: '2',
      amount: 67.25,
      pump: 'Pump 3',
      station: 'North Station',
      time: '10:25 AM',
      fuelType: 'diesel',
      volume: 18.2,
    },
    {
      id: '3',
      amount: 32.80,
      pump: 'Pump 2',
      station: 'Main Station',
      time: '10:20 AM',
      fuelType: 'gasoline',
      volume: 9.1,
    },
  ],
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'Maintenance Required',
      message: 'Pump 4 requires scheduled maintenance',
      timestamp: '2024-01-05T10:00:00Z',
      priority: 'medium',
    },
    {
      id: '2',
      type: 'info',
      title: 'Daily Report Ready',
      message: 'Yesterday\'s sales report is available for download',
      timestamp: '2024-01-05T09:00:00Z',
      priority: 'low',
    },
    {
      id: '3',
      type: 'error',
      title: 'System Alert',
      message: 'Connection issue with Pump 7',
      timestamp: '2024-01-05T08:30:00Z',
      priority: 'high',
    },
  ],
  inventory: {
    gasoline: { current: 45000, capacity: 60000, percentage: 75 },
    diesel: { current: 28000, capacity: 40000, percentage: 70 },
    premium: { current: 12000, capacity: 20000, percentage: 60 },
  },
};

// MSW server setup
const server = setupServer(
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.stats));
  }),
  rest.get('/api/dashboard/sales', (req, res, ctx) => {
    const dateRange = req.url.searchParams.get('range') || 'week';
    return res(ctx.json(mockDashboardData.salesData));
  }),
  rest.get('/api/dashboard/transactions', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.recentTransactions));
  }),
  rest.get('/api/dashboard/alerts', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.alerts));
  }),
  rest.get('/api/dashboard/inventory', (req, res, ctx) => {
    return res(ctx.json(mockDashboardData.inventory));
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
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('when dashboard loads', () => {
    it('should load and display all dashboard components', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      // Wait for all components to load
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
        expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
        expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
      });

      // Verify stats are displayed
      expect(screen.getByText('$125,000')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();

      // Verify transactions are displayed
      expect(screen.getByText('$45.50')).toBeInTheDocument();
      expect(screen.getByText('Pump 1')).toBeInTheDocument();

      // Verify alerts are displayed
      expect(screen.getByText('Maintenance Required')).toBeInTheDocument();
      expect(screen.getByText('System Alert')).toBeInTheDocument();
    });

    it('should handle loading states gracefully', async () => {
      // Mock slow API response
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.delay(1000), ctx.json(mockDashboardData.stats));
        })
      );

      render(<DashboardPage />, { wrapper: createWrapper() });

      // Should show loading state
      expect(screen.getByTestId('stats-loading')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
        })
      );

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('when user interacts with dashboard', () => {
    it('should refresh all data when refresh button is clicked', async () => {
      const statsHandler = vi.fn((req, res, ctx) => {
        return res(ctx.json(mockDashboardData.stats));
      });

      server.use(rest.get('/api/dashboard/stats', statsHandler));

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      // Should make new API calls
      await waitFor(() => {
        expect(statsHandler).toHaveBeenCalledTimes(2);
      });
    });

    it('should update charts when date range changes', async () => {
      const salesHandler = vi.fn((req, res, ctx) => {
        const range = req.url.searchParams.get('range');
        const data = range === 'month' 
          ? mockDashboardData.salesData.slice(0, 3)
          : mockDashboardData.salesData;
        return res(ctx.json(data));
      });

      server.use(rest.get('/api/dashboard/sales', salesHandler));

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      });

      const dateRangeSelect = screen.getByRole('combobox', { name: /date range/i });
      await user.selectOptions(dateRangeSelect, 'month');

      await waitFor(() => {
        expect(salesHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({
              searchParams: expect.objectContaining({
                get: expect.any(Function)
              })
            })
          }),
          expect.any(Object),
          expect.any(Object)
        );
      });
    });

    it('should navigate to detailed views from dashboard widgets', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      // Click on pumps stat to navigate to pumps page
      const pumpsCard = screen.getByTestId('pumps-stat-card');
      const viewDetailsButton = within(pumpsCard).getByRole('button', { name: /view details/i });
      await user.click(viewDetailsButton);

      expect(window.location.pathname).toBe('/pumps');
    });

    it('should handle alert interactions', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
      });

      // Click on high priority alert
      const alertsPanel = screen.getByTestId('alerts-panel');
      const highPriorityAlert = within(alertsPanel).getByText('System Alert');
      await user.click(highPriorityAlert);

      // Should open alert details modal
      expect(screen.getByRole('dialog', { name: /alert details/i })).toBeInTheDocument();
    });

    it('should filter transactions by pump', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
      });

      const transactionsPanel = screen.getByTestId('recent-transactions');
      const pumpFilter = within(transactionsPanel).getByRole('combobox', { name: /filter by pump/i });
      await user.selectOptions(pumpFilter, 'Pump 1');

      // Should only show transactions from Pump 1
      await waitFor(() => {
        expect(screen.getByText('$45.50')).toBeInTheDocument();
        expect(screen.queryByText('$67.25')).not.toBeInTheDocument();
      });
    });
  });

  describe('real-time updates', () => {
    it('should update data automatically', async () => {
      const statsHandler = vi.fn((req, res, ctx) => {
        return res(ctx.json(mockDashboardData.stats));
      });

      server.use(rest.get('/api/dashboard/stats', statsHandler));

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      // Simulate real-time update interval
      vi.advanceTimersByTime(30000); // 30 seconds

      await waitFor(() => {
        expect(statsHandler).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle WebSocket updates', async () => {
      // Mock WebSocket
      const mockWebSocket = {
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      global.WebSocket = vi.fn(() => mockWebSocket) as any;

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      // Simulate WebSocket message
      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1];

      if (messageHandler) {
        messageHandler({
          data: JSON.stringify({
            type: 'stats_update',
            data: { ...mockDashboardData.stats, totalSales: 130000 }
          })
        });
      }

      await waitFor(() => {
        expect(screen.getByText('$130,000')).toBeInTheDocument();
      });
    });
  });

  describe('responsive behavior', () => {
    it('should adapt layout for mobile devices', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      const dashboardContainer = screen.getByTestId('dashboard-container');
      expect(dashboardContainer).toHaveClass('mobile-layout');
    });

    it('should stack widgets vertically on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      const widgetGrid = screen.getByTestId('widget-grid');
      expect(widgetGrid).toHaveClass('vertical-stack');
    });
  });

  describe('accessibility integration', () => {
    it('should announce updates to screen readers', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      // Trigger refresh
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/dashboard updated/i);
      });
    });

    it('should support keyboard navigation between widgets', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      // Tab through widgets
      const firstWidget = screen.getByTestId('stats-widget');
      firstWidget.focus();

      await user.tab();
      const secondWidget = screen.getByTestId('chart-widget');
      expect(document.activeElement).toBe(secondWidget);

      await user.tab();
      const thirdWidget = screen.getByTestId('transactions-widget');
      expect(document.activeElement).toBe(thirdWidget);
    });
  });

  describe('performance integration', () => {
    it('should lazy load chart components', async () => {
      const chartImportSpy = vi.fn();
      
      // Mock dynamic import
      vi.doMock('@/components/dashboard/SalesChart', () => {
        chartImportSpy();
        return {
          SalesChart: () => <div data-testid="sales-chart">Sales Chart</div>
        };
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      // Chart should not be imported initially
      expect(chartImportSpy).not.toHaveBeenCalled();

      // Scroll to chart section
      const chartSection = screen.getByTestId('chart-section');
      chartSection.scrollIntoView();

      await waitFor(() => {
        expect(chartImportSpy).toHaveBeenCalled();
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      });
    });

    it('should virtualize large transaction lists', async () => {
      // Mock large transaction list
      const largeTransactionList = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i + 1),
        amount: Math.random() * 100,
        pump: `Pump ${(i % 10) + 1}`,
        station: 'Main Station',
        time: '10:30 AM',
        fuelType: 'gasoline',
        volume: Math.random() * 20,
      }));

      server.use(
        rest.get('/api/dashboard/transactions', (req, res, ctx) => {
          return res(ctx.json(largeTransactionList));
        })
      );

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
      });

      // Should only render visible items
      const transactionItems = screen.getAllByTestId('transaction-item');
      expect(transactionItems.length).toBeLessThan(50); // Virtual scrolling limit
    });
  });

  describe('error recovery integration', () => {
    it('should recover from partial failures', async () => {
      // Mock partial API failure
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.json(mockDashboardData.stats));
        }),
        rest.get('/api/dashboard/sales', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
        rest.get('/api/dashboard/transactions', (req, res, ctx) => {
          return res(ctx.json(mockDashboardData.recentTransactions));
        })
      );

      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        // Stats should load successfully
        expect(screen.getByText('$125,000')).toBeInTheDocument();
        
        // Transactions should load successfully
        expect(screen.getByText('$45.50')).toBeInTheDocument();
        
        // Sales chart should show error
        expect(screen.getByText(/error loading chart/i)).toBeInTheDocument();
      });
    });

    it('should retry failed requests', async () => {
      let callCount = 0;
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          callCount++;
          if (callCount === 1) {
            return res(ctx.status(500));
          }
          return res(ctx.json(mockDashboardData.stats));
        })
      );

      render(<DashboardPage />, { wrapper: createWrapper() });

      // Should show error initially
      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Should succeed on retry
      await waitFor(() => {
        expect(screen.getByText('$125,000')).toBeInTheDocument();
      });
    });
  });
});
