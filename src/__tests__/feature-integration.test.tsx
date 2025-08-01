/**
 * @file __tests__/feature-integration.test.tsx
 * @description Comprehensive feature integration tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Import components for integration testing
import { Dashboard } from '@/pages/Dashboard';
import { PumpsPage } from '@/pages/PumpsPage';
import { StationsPage } from '@/pages/StationsPage';
import { App } from '@/App';

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

// Mock all hooks
vi.mock('@/hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

vi.mock('@/hooks/usePumps', () => ({
  usePumps: vi.fn(),
  usePump: vi.fn(),
  useCreatePump: vi.fn(),
  useUpdatePump: vi.fn(),
  useDeletePump: vi.fn(),
}));

vi.mock('@/hooks/useStations', () => ({
  useStations: vi.fn(),
  useStation: vi.fn(),
  useCreateStation: vi.fn(),
  useUpdateStation: vi.fn(),
  useDeleteStation: vi.fn(),
}));

vi.mock('@/hooks/useSales', () => ({
  useSales: vi.fn(),
  useSalesReport: vi.fn(),
}));

vi.mock('@/hooks/useAlerts', () => ({
  useAlerts: vi.fn(),
  useMarkAlertRead: vi.fn(),
}));

// Mock UI components that might cause issues in tests
vi.mock('@/components/ui/chart', () => ({
  Chart: ({ children }: any) => <div data-testid="chart">{children}</div>,
  ChartContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ children }: any) => <div data-testid="chart-tooltip">{children}</div>,
}));

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => (
    <div data-testid="calendar">
      <button onClick={() => onSelect(new Date())}>Select Date</button>
    </div>
  ),
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ children }: any) => <div data-testid="popover-trigger">{children}</div>,
}));

// Mock toast notifications
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => {
  const icons = [
    'Home', 'Fuel', 'Building', 'Gauge', 'BarChart3', 'Settings', 'Users',
    'Plus', 'Edit', 'Trash2', 'Eye', 'RefreshCw', 'Download', 'Calendar',
    'Search', 'Filter', 'MoreVertical', 'ChevronDown', 'ChevronUp',
    'TrendingUp', 'TrendingDown', 'DollarSign', 'Activity', 'AlertTriangle',
    'CheckCircle', 'Clock', 'X', 'Menu'
  ];
  
  const mockIcons: any = {};
  icons.forEach(icon => {
    mockIcons[icon] = () => <div data-testid={`${icon.toLowerCase()}-icon`}>{icon}</div>;
  });
  
  return mockIcons;
});

// Test wrapper with all providers
const TestWrapper = ({ 
  children, 
  initialRoute = '/' 
}: { 
  children: React.ReactNode;
  initialRoute?: string;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {children}
      </MemoryRouter>
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
  },
];

const mockStations = [
  {
    id: 'station-1',
    name: 'Station A',
    location: 'Downtown',
    status: 'active',
    pumpCount: 8,
    address: '123 Main St',
  },
  {
    id: 'station-2',
    name: 'Station B',
    location: 'Uptown',
    status: 'active',
    pumpCount: 6,
    address: '456 Oak Ave',
  },
];

const mockSales = [
  {
    id: '1',
    amount: 50.00,
    timestamp: new Date(),
    pumpId: '1',
    fuelType: 'gasoline',
    quantity: 12.5,
  },
  {
    id: '2',
    amount: 75.50,
    timestamp: new Date(),
    pumpId: '2',
    fuelType: 'diesel',
    quantity: 18.2,
  },
];

const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'Pump 2 requires maintenance',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'error',
    message: 'Station B offline',
    timestamp: new Date(),
    read: false,
  },
];

describe('Feature Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock implementations
    vi.mocked(require('@/hooks/useDashboard').useDashboard).mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    vi.mocked(require('@/hooks/usePumps').usePumps).mockReturnValue({
      data: mockPumps,
      isLoading: false,
      error: null,
    });

    vi.mocked(require('@/hooks/useStations').useStations).mockReturnValue({
      data: mockStations,
      isLoading: false,
      error: null,
    });

    vi.mocked(require('@/hooks/useSales').useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
    });

    vi.mocked(require('@/hooks/useAlerts').useAlerts).mockReturnValue({
      data: mockAlerts,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Dashboard Integration', () => {
    it('displays complete dashboard with all data', async () => {
      render(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      // Check main dashboard elements
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Check stats are displayed
      await waitFor(() => {
        expect(screen.getByText('$125,000.50')).toBeInTheDocument();
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });

      // Check charts and components are rendered
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    it('handles dashboard refresh functionality', async () => {
      const mockRefetch = vi.fn();
      vi.mocked(require('@/hooks/useDashboard').useDashboard).mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      const refreshButton = screen.getByText('Refresh');
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('handles dashboard error states gracefully', async () => {
      vi.mocked(require('@/hooks/useDashboard').useDashboard).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load dashboard'),
        refetch: vi.fn(),
      });

      render(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('Pump Management Integration', () => {
    it('displays pump list with filtering and actions', async () => {
      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Check pump list is displayed
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Pump 1')).toBeInTheDocument();
      expect(screen.getByText('Pump 2')).toBeInTheDocument();

      // Check filter functionality
      const filterButton = screen.getByTestId('filter-icon');
      await user.click(filterButton);

      // Should show filter options
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Station')).toBeInTheDocument();
    });

    it('handles pump creation workflow', async () => {
      const mockCreatePump = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      vi.mocked(require('@/hooks/usePumps').useCreatePump).mockReturnValue(mockCreatePump());

      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Click add pump button
      const addButton = screen.getByText('Add Pump');
      await user.click(addButton);

      // Should open create pump dialog
      expect(screen.getByText('Create New Pump')).toBeInTheDocument();

      // Fill form fields
      const nameInput = screen.getByLabelText('Pump Name');
      await user.type(nameInput, 'New Pump');

      const serialInput = screen.getByLabelText('Serial Number');
      await user.type(serialInput, 'SN003');

      // Submit form
      const submitButton = screen.getByText('Create Pump');
      await user.click(submitButton);

      expect(mockCreatePump().mutate).toHaveBeenCalledWith({
        name: 'New Pump',
        serialNumber: 'SN003',
      });
    });

    it('handles pump editing workflow', async () => {
      const mockUpdatePump = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      vi.mocked(require('@/hooks/usePumps').useUpdatePump).mockReturnValue(mockUpdatePump());

      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Find and click edit button for first pump
      const pumpCard = screen.getByText('Pump 1').closest('[data-testid="pump-card"]');
      const editButton = within(pumpCard!).getByTestId('edit-icon');
      await user.click(editButton);

      // Should open edit dialog
      expect(screen.getByText('Edit Pump')).toBeInTheDocument();

      // Modify pump name
      const nameInput = screen.getByDisplayValue('Pump 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Pump 1');

      // Submit changes
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(mockUpdatePump().mutate).toHaveBeenCalledWith({
        id: '1',
        data: { name: 'Updated Pump 1' },
      });
    });

    it('handles pump deletion with confirmation', async () => {
      const mockDeletePump = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      vi.mocked(require('@/hooks/usePumps').useDeletePump).mockReturnValue(mockDeletePump());

      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Find and click delete button
      const pumpCard = screen.getByText('Pump 1').closest('[data-testid="pump-card"]');
      const deleteButton = within(pumpCard!).getByTestId('trash2-icon');
      await user.click(deleteButton);

      // Should show confirmation dialog
      expect(screen.getByText('Delete Pump')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this pump?')).toBeInTheDocument();

      // Confirm deletion
      const confirmButton = screen.getByText('Delete');
      await user.click(confirmButton);

      expect(mockDeletePump().mutate).toHaveBeenCalledWith('1');
    });
  });

  describe('Station Management Integration', () => {
    it('displays station list with pump associations', async () => {
      render(
        <TestWrapper initialRoute="/stations">
          <StationsPage />
        </TestWrapper>
      );

      expect(screen.getByText('Stations')).toBeInTheDocument();
      expect(screen.getByText('Station A')).toBeInTheDocument();
      expect(screen.getByText('Station B')).toBeInTheDocument();

      // Check pump count display
      expect(screen.getByText('8 pumps')).toBeInTheDocument();
      expect(screen.getByText('6 pumps')).toBeInTheDocument();
    });

    it('handles station status changes', async () => {
      const mockUpdateStation = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      vi.mocked(require('@/hooks/useStations').useUpdateStation).mockReturnValue(mockUpdateStation());

      render(
        <TestWrapper initialRoute="/stations">
          <StationsPage />
        </TestWrapper>
      );

      // Find station status toggle
      const stationCard = screen.getByText('Station A').closest('[data-testid="station-card"]');
      const statusToggle = within(stationCard!).getByRole('switch');
      
      await user.click(statusToggle);

      expect(mockUpdateStation().mutate).toHaveBeenCalledWith({
        id: 'station-1',
        data: { status: 'inactive' },
      });
    });
  });

  describe('Cross-Feature Integration', () => {
    it('navigates between features maintaining state', async () => {
      render(
        <TestWrapper initialRoute="/dashboard">
          <App />
        </TestWrapper>
      );

      // Start on dashboard
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Navigate to pumps
      const pumpsLink = screen.getByText('Pumps');
      await user.click(pumpsLink);

      expect(screen.getByText('Pump Management')).toBeInTheDocument();

      // Navigate to stations
      const stationsLink = screen.getByText('Stations');
      await user.click(stationsLink);

      expect(screen.getByText('Station Management')).toBeInTheDocument();

      // Navigate back to dashboard
      const dashboardLink = screen.getByText('Dashboard');
      await user.click(dashboardLink);

      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    it('handles real-time updates across features', async () => {
      const { rerender } = render(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      // Initial state
      expect(screen.getByText('$125,000.50')).toBeInTheDocument();

      // Simulate real-time update
      vi.mocked(require('@/hooks/useDashboard').useDashboard).mockReturnValue({
        data: { ...mockDashboardData, totalSales: 130000.00 },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      rerender(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('$130,000.00')).toBeInTheDocument();
    });

    it('handles error propagation across features', async () => {
      // Simulate network error affecting multiple features
      const networkError = new Error('Network connection lost');

      vi.mocked(require('@/hooks/useDashboard').useDashboard).mockReturnValue({
        data: null,
        isLoading: false,
        error: networkError,
        refetch: vi.fn(),
      });

      vi.mocked(require('@/hooks/usePumps').usePumps).mockReturnValue({
        data: null,
        isLoading: false,
        error: networkError,
      });

      render(
        <TestWrapper initialRoute="/dashboard">
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();

      // Navigate to pumps - should also show error
      const pumpsLink = screen.getByText('Pumps');
      await user.click(pumpsLink);

      expect(screen.getByText('Error loading pumps')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('handles large datasets efficiently', async () => {
      const largePumpList = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Pump ${i}`,
        status: 'active',
        stationId: 'station-1',
        nozzleCount: 4,
      }));

      vi.mocked(require('@/hooks/usePumps').usePumps).mockReturnValue({
        data: largePumpList,
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Should render without performance issues
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Pump 0')).toBeInTheDocument();
    });

    it('handles concurrent operations gracefully', async () => {
      const mockCreatePump = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      const mockUpdatePump = vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isLoading: false,
        error: null,
      });

      vi.mocked(require('@/hooks/usePumps').useCreatePump).mockReturnValue(mockCreatePump());
      vi.mocked(require('@/hooks/usePumps').useUpdatePump).mockReturnValue(mockUpdatePump());

      render(
        <TestWrapper initialRoute="/pumps">
          <PumpsPage />
        </TestWrapper>
      );

      // Trigger multiple operations simultaneously
      const addButton = screen.getByText('Add Pump');
      const editButton = screen.getByTestId('edit-icon');

      await Promise.all([
        user.click(addButton),
        user.click(editButton),
      ]);

      // Should handle concurrent operations
      expect(screen.getByText('Create New Pump')).toBeInTheDocument();
      expect(screen.getByText('Edit Pump')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains accessibility across feature navigation', async () => {
      render(
        <TestWrapper initialRoute="/dashboard">
          <App />
        </TestWrapper>
      );

      // Check initial accessibility
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Navigate and check accessibility is maintained
      const pumpsLink = screen.getByText('Pumps');
      await user.click(pumpsLink);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('supports keyboard navigation across features', async () => {
      render(
        <TestWrapper initialRoute="/dashboard">
          <App />
        </TestWrapper>
      );

      // Tab through navigation
      await user.tab();
      expect(screen.getByText('Dashboard')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Pumps')).toHaveFocus();

      // Enter to navigate
      await user.keyboard('{Enter}');
      expect(screen.getByText('Pump Management')).toBeInTheDocument();
    });
  });
});
