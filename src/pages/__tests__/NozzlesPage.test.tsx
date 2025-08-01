/**
 * @file pages/__tests__/NozzlesPage.test.tsx
 * @description Tests for the Nozzles page component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import NozzlesPage from '../dashboard/NozzlesPage';

// Mock nozzle data
const mockNozzles = [
  {
    id: '1',
    name: 'Nozzle 1A',
    pumpId: 'pump-1',
    pumpName: 'Pump 1',
    stationId: 'station-1',
    stationName: 'Main Station',
    fuelType: 'gasoline',
    status: 'active',
    flowRate: 10.5,
    lastMaintenance: '2024-01-15',
    totalDispensed: 15000,
  },
  {
    id: '2',
    name: 'Nozzle 1B',
    pumpId: 'pump-1',
    pumpName: 'Pump 1',
    stationId: 'station-1',
    stationName: 'Main Station',
    fuelType: 'diesel',
    status: 'active',
    flowRate: 8.2,
    lastMaintenance: '2024-01-10',
    totalDispensed: 12000,
  },
  {
    id: '3',
    name: 'Nozzle 2A',
    pumpId: 'pump-2',
    pumpName: 'Pump 2',
    stationId: 'station-1',
    stationName: 'Main Station',
    fuelType: 'gasoline',
    status: 'maintenance',
    flowRate: 9.8,
    lastMaintenance: '2024-01-20',
    totalDispensed: 8500,
  },
];

// Mock API hooks
vi.mock('@/hooks/api/useNozzles', () => ({
  useNozzles: () => ({
    data: mockNozzles,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreateNozzle: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useUpdateNozzle: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useDeleteNozzle: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/api/usePumps', () => ({
  usePumps: () => ({
    data: [
      { id: 'pump-1', name: 'Pump 1', stationId: 'station-1' },
      { id: 'pump-2', name: 'Pump 2', stationId: 'station-1' },
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

describe('NozzlesPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display the page title', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('heading', { name: /nozzles/i })).toBeInTheDocument();
    });

    it('should display all nozzles in a table', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 1A')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 1B')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 2A')).toBeInTheDocument();
      });
    });

    it('should show nozzle details', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText('gasoline')).toBeInTheDocument();
      expect(screen.getByText('diesel')).toBeInTheDocument();
      expect(screen.getByText('10.5 L/min')).toBeInTheDocument();
      expect(screen.getByText('15,000 L')).toBeInTheDocument();
    });

    it('should display action buttons', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('button', { name: /add nozzle/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });
  });

  describe('when filtering and searching', () => {
    it('should search nozzles by name', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      await user.type(searchInput, 'Nozzle 1A');
      
      await waitFor(() => {
        expect(screen.getByText('Nozzle 1A')).toBeInTheDocument();
        expect(screen.queryByText('Nozzle 1B')).not.toBeInTheDocument();
        expect(screen.queryByText('Nozzle 2A')).not.toBeInTheDocument();
      });
    });

    it('should filter by fuel type', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const fuelTypeFilter = screen.getByRole('combobox', { name: /fuel type/i });
      await user.selectOptions(fuelTypeFilter, 'diesel');
      
      await waitFor(() => {
        expect(screen.queryByText('Nozzle 1A')).not.toBeInTheDocument();
        expect(screen.getByText('Nozzle 1B')).toBeInTheDocument();
        expect(screen.queryByText('Nozzle 2A')).not.toBeInTheDocument();
      });
    });

    it('should filter by status', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'maintenance');
      
      await waitFor(() => {
        expect(screen.queryByText('Nozzle 1A')).not.toBeInTheDocument();
        expect(screen.queryByText('Nozzle 1B')).not.toBeInTheDocument();
        expect(screen.getByText('Nozzle 2A')).toBeInTheDocument();
      });
    });

    it('should filter by pump', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const pumpFilter = screen.getByRole('combobox', { name: /pump/i });
      await user.selectOptions(pumpFilter, 'pump-1');
      
      await waitFor(() => {
        expect(screen.getByText('Nozzle 1A')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 1B')).toBeInTheDocument();
        expect(screen.queryByText('Nozzle 2A')).not.toBeInTheDocument();
      });
    });

    it('should clear all filters', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      // Apply filters
      const fuelTypeFilter = screen.getByRole('combobox', { name: /fuel type/i });
      await user.selectOptions(fuelTypeFilter, 'gasoline');
      
      // Clear filters
      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText('Nozzle 1A')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 1B')).toBeInTheDocument();
        expect(screen.getByText('Nozzle 2A')).toBeInTheDocument();
      });
    });
  });

  describe('when managing nozzles', () => {
    it('should open create nozzle modal', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add nozzle/i });
      await user.click(addButton);
      
      expect(screen.getByRole('dialog', { name: /create nozzle/i })).toBeInTheDocument();
    });

    it('should create a new nozzle', async () => {
      const mockCreate = vi.fn();
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useCreateNozzle: () => ({
          mutate: mockCreate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add nozzle/i });
      await user.click(addButton);
      
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const pumpSelect = within(modal).getByRole('combobox', { name: /pump/i });
      const fuelTypeSelect = within(modal).getByRole('combobox', { name: /fuel type/i });
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      
      await user.type(nameInput, 'New Nozzle');
      await user.selectOptions(pumpSelect, 'pump-1');
      await user.selectOptions(fuelTypeSelect, 'gasoline');
      await user.click(submitButton);
      
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'New Nozzle',
        pumpId: 'pump-1',
        fuelType: 'gasoline',
      });
    });

    it('should edit an existing nozzle', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);
      
      expect(screen.getByRole('dialog', { name: /edit nozzle/i })).toBeInTheDocument();
    });

    it('should delete a nozzle with confirmation', async () => {
      const mockDelete = vi.fn();
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useDeleteNozzle: () => ({
          mutate: mockDelete,
          isLoading: false,
          error: null,
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      const confirmDialog = screen.getByRole('dialog', { name: /confirm delete/i });
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);
      
      expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('should update nozzle status', async () => {
      const mockUpdate = vi.fn();
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useUpdateNozzle: () => ({
          mutate: mockUpdate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const statusButtons = screen.getAllByRole('button', { name: /change status/i });
      await user.click(statusButtons[0]);
      
      const statusMenu = screen.getByRole('menu');
      const maintenanceOption = within(statusMenu).getByRole('menuitem', { name: /maintenance/i });
      await user.click(maintenanceOption);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        id: '1',
        status: 'maintenance',
      });
    });
  });

  describe('when sorting', () => {
    it('should sort by name', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Nozzle 1A')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Nozzle 1B')).toBeInTheDocument();
      expect(within(rows[3]).getByText('Nozzle 2A')).toBeInTheDocument();
    });

    it('should sort by flow rate', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const flowRateHeader = screen.getByRole('columnheader', { name: /flow rate/i });
      await user.click(flowRateHeader);
      
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('8.2 L/min')).toBeInTheDocument();
      expect(within(rows[2]).getByText('9.8 L/min')).toBeInTheDocument();
      expect(within(rows[3]).getByText('10.5 L/min')).toBeInTheDocument();
    });

    it('should sort by total dispensed', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const totalHeader = screen.getByRole('columnheader', { name: /total dispensed/i });
      await user.click(totalHeader);
      
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('8,500 L')).toBeInTheDocument();
      expect(within(rows[2]).getByText('12,000 L')).toBeInTheDocument();
      expect(within(rows[3]).getByText('15,000 L')).toBeInTheDocument();
    });
  });

  describe('when handling errors', () => {
    it('should display error message when loading fails', () => {
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useNozzles: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load nozzles'),
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/failed to load nozzles/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle create nozzle errors', async () => {
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useCreateNozzle: () => ({
          mutate: vi.fn(),
          isLoading: false,
          error: new Error('Failed to create nozzle'),
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add nozzle/i });
      await user.click(addButton);
      
      expect(screen.getByText(/failed to create nozzle/i)).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('should show loading state', () => {
      vi.doMock('@/hooks/api/useNozzles', () => ({
        useNozzles: () => ({
          data: null,
          isLoading: true,
          error: null,
        }),
      }));

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/loading nozzles/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper table structure', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const table = screen.getByRole('table');
      expect(table).toHaveAccessibleName(/nozzles/i);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(8); // Name, Pump, Station, Fuel Type, Status, Flow Rate, Total Dispensed, Actions
    });

    it('should support keyboard navigation', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add nozzle/i });
      addButton.focus();
      
      expect(document.activeElement).toBe(addButton);
      
      await user.tab();
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(document.activeElement).toBe(refreshButton);
    });

    it('should announce table updates', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/nozzles updated/i);
      });
    });
  });

  describe('responsive behavior', () => {
    it('should adapt table for mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('mobile-table');
    });

    it('should show card view on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByTestId('nozzles-card-view')).toBeInTheDocument();
    });
  });

  describe('maintenance tracking', () => {
    it('should highlight nozzles due for maintenance', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const maintenanceIndicators = screen.getAllByTestId('maintenance-indicator');
      expect(maintenanceIndicators).toHaveLength(1); // Nozzle 2A is in maintenance
    });

    it('should show maintenance schedule', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const scheduleButton = screen.getByRole('button', { name: /maintenance schedule/i });
      await user.click(scheduleButton);
      
      expect(screen.getByRole('dialog', { name: /maintenance schedule/i })).toBeInTheDocument();
    });
  });

  describe('performance monitoring', () => {
    it('should display flow rate charts', async () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      const chartsButton = screen.getByRole('button', { name: /show charts/i });
      await user.click(chartsButton);
      
      expect(screen.getByTestId('flow-rate-chart')).toBeInTheDocument();
    });

    it('should show efficiency metrics', () => {
      render(<NozzlesPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/average flow rate/i)).toBeInTheDocument();
      expect(screen.getByText(/total dispensed today/i)).toBeInTheDocument();
    });
  });
});
