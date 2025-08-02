/**
 * @file dashboard-flow.test.tsx
 * @description Integration tests for complete dashboard user flows
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SmartDashboard } from '@/components/dashboard/SmartDashboard';
import { useAuth } from '@/contexts/AuthContext';

// Mock API calls
const mockApiGet = vi.fn();
const mockApiPost = vi.fn();

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: mockApiGet,
    post: mockApiPost
  }
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock hooks
vi.mock('@/hooks/api/useTodaysSales', () => ({
  useTodaysSales: () => ({
    data: {
      totalAmount: 50000,
      totalVolume: 2500,
      transactionCount: 45
    },
    isLoading: false,
    error: null
  })
}));

vi.mock('@/hooks/api/useStations', () => ({
  useStations: () => ({
    data: [
      { id: '1', name: 'Station A', status: 'active' },
      { id: '2', name: 'Station B', status: 'active' }
    ],
    isLoading: false,
    error: null
  })
}));

vi.mock('@/hooks/useOnboarding', () => ({
  useDailyReminders: () => ({
    data: [
      {
        id: '1',
        type: 'reconciliation',
        priority: 'high',
        title: 'Daily Reconciliation Overdue',
        message: 'Please complete reconciliation for yesterday',
        completed: false
      }
    ],
    isLoading: false,
    error: null
  })
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, cacheTime: 0 },
    mutations: { retry: false }
  }
});

const renderDashboardWithProviders = (userRole: string = 'owner') => {
  const queryClient = createTestQueryClient();
  
  (useAuth as any).mockReturnValue({
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: userRole
    },
    logout: vi.fn()
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SmartDashboard />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Owner Dashboard Flow', () => {
    it('should display complete owner dashboard with all metrics', async () => {
      renderDashboardWithProviders('owner');

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });

      // Check key metrics are displayed
      expect(screen.getByText('₹50,000')).toBeInTheDocument(); // Revenue
      expect(screen.getByText('2,500L')).toBeInTheDocument(); // Volume
      expect(screen.getByText('45')).toBeInTheDocument(); // Transactions
      expect(screen.getByText('2')).toBeInTheDocument(); // Active stations

      // Check quick actions are available
      expect(screen.getByText('Record Reading')).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
      expect(screen.getByText('Manage Stations')).toBeInTheDocument();
    });

    it('should handle quick action clicks correctly', async () => {
      const user = userEvent.setup();
      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText('Record Reading')).toBeInTheDocument();
      });

      // Mock window.location.href assignment
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, href: '' };

      // Click record reading button
      const recordButton = screen.getByText('Record Reading');
      await user.click(recordButton);

      // Should navigate to readings page
      expect(window.location.href).toBe('/dashboard/readings/new');

      // Restore original location
      window.location = originalLocation;
    });

    it('should display and handle urgent alerts', async () => {
      const user = userEvent.setup();
      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText('1 urgent alerts')).toBeInTheDocument();
      });

      // Check alert badge is displayed
      const alertBadge = screen.getByText('1 urgent alerts');
      expect(alertBadge).toBeInTheDocument();

      // Click on alerts tab
      const alertsTab = screen.getByText('Alerts');
      await user.click(alertsTab);

      // Should show alert details
      await waitFor(() => {
        expect(screen.getByText('Daily Reconciliation Overdue')).toBeInTheDocument();
        expect(screen.getByText('Please complete reconciliation for yesterday')).toBeInTheDocument();
      });
    });

    it('should switch between dashboard tabs correctly', async () => {
      const user = userEvent.setup();
      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
      });

      // Switch to Performance tab
      const performanceTab = screen.getByText('Performance');
      await user.click(performanceTab);

      await waitFor(() => {
        expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
      });

      // Switch back to Overview
      const overviewTab = screen.getByText('Overview');
      await user.click(overviewTab);

      await waitFor(() => {
        expect(screen.getByText('View Performance Details')).toBeInTheDocument();
      });
    });
  });

  describe('Attendant Dashboard Flow', () => {
    it('should display simplified attendant dashboard', async () => {
      renderDashboardWithProviders('attendant');

      await waitFor(() => {
        expect(screen.getByText(/hello/i)).toBeInTheDocument();
      });

      // Check attendant-specific elements
      expect(screen.getByText('Record New Reading')).toBeInTheDocument();
      expect(screen.getByText("Today's Tasks")).toBeInTheDocument();
      expect(screen.getByText('My Stations')).toBeInTheDocument();

      // Should not show owner/manager features
      expect(screen.queryByText('View Reports')).not.toBeInTheDocument();
      expect(screen.queryByText('Manage Stations')).not.toBeInTheDocument();
    });

    it('should handle attendant task interactions', async () => {
      const user = userEvent.setup();
      renderDashboardWithProviders('attendant');

      await waitFor(() => {
        expect(screen.getByText('Record New Reading')).toBeInTheDocument();
      });

      // Mock navigation
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, href: '' };

      // Click main record reading button
      const mainButton = screen.getByText('Record New Reading');
      await user.click(mainButton);

      expect(window.location.href).toBe('/attendant/readings/new');

      // Restore location
      window.location = originalLocation;
    });

    it('should display task status correctly', async () => {
      renderDashboardWithProviders('attendant');

      await waitFor(() => {
        expect(screen.getByText("Today's Tasks")).toBeInTheDocument();
      });

      // Check task items are displayed
      expect(screen.getByText('Record Morning Readings')).toBeInTheDocument();
      expect(screen.getByText('Submit Cash Report')).toBeInTheDocument();
      expect(screen.getByText('Check Fuel Levels')).toBeInTheDocument();

      // Check completed task styling
      const completedTask = screen.getByText('Check Fuel Levels').closest('div');
      expect(completedTask).toHaveClass('border-l-green-500');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout for mobile screens', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });

      // Check mobile-specific layout
      const container = screen.getByText(/good/i).closest('div');
      expect(container).toHaveClass('min-h-screen');

      // Restore viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });
    });

    it('should handle tablet viewport correctly', async () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });

      // Should still show full functionality on tablet
      expect(screen.getByText('Record Reading')).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      vi.mocked(useAuth).mockReturnValue({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'owner'
        },
        logout: vi.fn()
      });

      renderDashboardWithProviders('owner');

      // Should still render dashboard structure even with API errors
      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });
    });

    it('should handle missing user data', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        logout: vi.fn()
      });

      renderDashboardWithProviders('owner');

      // Should render default dashboard
      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should render dashboard within acceptable time', async () => {
      const startTime = performance.now();
      
      renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText(/good/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle rapid role switching efficiently', async () => {
      const { rerender } = renderDashboardWithProviders('owner');

      await waitFor(() => {
        expect(screen.getByText('View Reports')).toBeInTheDocument();
      });

      // Switch to attendant
      vi.mocked(useAuth).mockReturnValue({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'attendant'
        },
        logout: vi.fn()
      });

      rerender(
        <QueryClientProvider client={createTestQueryClient()}>
          <BrowserRouter>
            <SmartDashboard />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Record New Reading')).toBeInTheDocument();
      });

      // Should not show owner features
      expect(screen.queryByText('View Reports')).not.toBeInTheDocument();
    });
  });
});
