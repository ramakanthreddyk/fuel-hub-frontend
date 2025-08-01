/**
 * @file pages/__tests__/PumpsPage.test.tsx
 * @description Tests for the Pumps page component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import PumpsPage from '../dashboard/PumpsPage';

// Mock pump data
const mockPumps = [
  {
    id: '1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    status: 'active',
    nozzleCount: 4,
    lastMaintenance: '2024-01-15',
    fuelType: 'gasoline',
  },
  {
    id: '2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    status: 'maintenance',
    nozzleCount: 2,
    lastMaintenance: '2024-01-10',
    fuelType: 'diesel',
  },
  {
    id: '3',
    name: 'Pump 3',
    serialNumber: 'SN003',
    stationId: 'station-2',
    status: 'inactive',
    nozzleCount: 6,
    lastMaintenance: '2024-01-20',
    fuelType: 'gasoline',
  },
];

// Mock API hooks
vi.mock('@/hooks/api/usePumps', () => ({
  usePumps: () => ({
    data: mockPumps,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreatePump: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useUpdatePump: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useDeletePump: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/api/useStations', () => ({
  useStations: () => ({
    data: [
      { id: 'station-1', name: 'Main Station' },
      { id: 'station-2', name: 'North Station' },
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

describe('PumpsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display the page title', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('heading', { name: /pumps/i })).toBeInTheDocument();
    });

    it('should display all pumps in a table', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
        expect(screen.getByText('Pump 3')).toBeInTheDocument();
      });
    });

    it('should show pump status indicators', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('maintenance')).toBeInTheDocument();
      expect(screen.getByText('inactive')).toBeInTheDocument();
    });

    it('should display action buttons', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('button', { name: /add pump/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });
  });

  describe('when filtering and searching', () => {
    it('should filter pumps by status', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'active');
      
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.queryByText('Pump 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Pump 3')).not.toBeInTheDocument();
      });
    });

    it('should search pumps by name', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      await user.type(searchInput, 'Pump 2');
      
      await waitFor(() => {
        expect(screen.queryByText('Pump 1')).not.toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
        expect(screen.queryByText('Pump 3')).not.toBeInTheDocument();
      });
    });

    it('should filter by station', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const stationFilter = screen.getByRole('combobox', { name: /station/i });
      await user.selectOptions(stationFilter, 'station-1');
      
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
        expect(screen.queryByText('Pump 3')).not.toBeInTheDocument();
      });
    });

    it('should clear filters', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      // Apply filter
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'active');
      
      // Clear filter
      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pump 1')).toBeInTheDocument();
        expect(screen.getByText('Pump 2')).toBeInTheDocument();
        expect(screen.getByText('Pump 3')).toBeInTheDocument();
      });
    });
  });

  describe('when managing pumps', () => {
    it('should open create pump modal', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);
      
      expect(screen.getByRole('dialog', { name: /create pump/i })).toBeInTheDocument();
    });

    it('should create a new pump', async () => {
      const mockCreate = vi.fn();
      vi.doMock('@/hooks/api/usePumps', () => ({
        useCreatePump: () => ({
          mutate: mockCreate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);
      
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const serialInput = within(modal).getByRole('textbox', { name: /serial/i });
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      
      await user.type(nameInput, 'New Pump');
      await user.type(serialInput, 'SN004');
      await user.click(submitButton);
      
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'New Pump',
        serialNumber: 'SN004',
      });
    });

    it('should edit an existing pump', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);
      
      expect(screen.getByRole('dialog', { name: /edit pump/i })).toBeInTheDocument();
    });

    it('should delete a pump with confirmation', async () => {
      const mockDelete = vi.fn();
      vi.doMock('@/hooks/api/usePumps', () => ({
        useDeletePump: () => ({
          mutate: mockDelete,
          isLoading: false,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      const confirmDialog = screen.getByRole('dialog', { name: /confirm delete/i });
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);
      
      expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('should update pump status', async () => {
      const mockUpdate = vi.fn();
      vi.doMock('@/hooks/api/usePumps', () => ({
        useUpdatePump: () => ({
          mutate: mockUpdate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
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
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Pump 1')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Pump 2')).toBeInTheDocument();
      expect(within(rows[3]).getByText('Pump 3')).toBeInTheDocument();
    });

    it('should sort by status', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const statusHeader = screen.getByRole('columnheader', { name: /status/i });
      await user.click(statusHeader);
      
      // Should sort alphabetically: active, inactive, maintenance
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('active')).toBeInTheDocument();
      expect(within(rows[2]).getByText('inactive')).toBeInTheDocument();
      expect(within(rows[3]).getByText('maintenance')).toBeInTheDocument();
    });

    it('should reverse sort order on second click', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Pump 3')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Pump 2')).toBeInTheDocument();
      expect(within(rows[3]).getByText('Pump 1')).toBeInTheDocument();
    });
  });

  describe('when handling errors', () => {
    it('should display error message when loading fails', () => {
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load pumps'),
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/failed to load pumps/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle create pump errors', async () => {
      vi.doMock('@/hooks/api/usePumps', () => ({
        useCreatePump: () => ({
          mutate: vi.fn(),
          isLoading: false,
          error: new Error('Failed to create pump'),
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);
      
      expect(screen.getByText(/failed to create pump/i)).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('should show loading state', () => {
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => ({
          data: null,
          isLoading: true,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/loading pumps/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show loading state for actions', async () => {
      vi.doMock('@/hooks/api/usePumps', () => ({
        useCreatePump: () => ({
          mutate: vi.fn(),
          isLoading: true,
          error: null,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add pump/i });
      await user.click(addButton);
      
      const modal = screen.getByRole('dialog');
      const submitButton = within(modal).getByRole('button', { name: /creating/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper table structure', () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const table = screen.getByRole('table');
      expect(table).toHaveAccessibleName(/pumps/i);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(6); // Name, Serial, Station, Status, Nozzles, Actions
    });

    it('should support keyboard navigation', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add pump/i });
      addButton.focus();
      
      expect(document.activeElement).toBe(addButton);
      
      // Tab to next focusable element
      await user.tab();
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(document.activeElement).toBe(refreshButton);
    });

    it('should announce table updates', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      // Trigger update
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/pumps updated/i);
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

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('mobile-table');
    });

    it('should show card view on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<PumpsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByTestId('pumps-card-view')).toBeInTheDocument();
    });
  });
});
