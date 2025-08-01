/**
 * @file pages/__tests__/StationsPage.test.tsx
 * @description Tests for the Stations page component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import StationsPage from '../dashboard/StationsPage';

// Mock station data
const mockStations = [
  {
    id: '1',
    name: 'Main Station',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phone: '555-0123',
    manager: 'John Doe',
    status: 'active',
    pumpCount: 8,
    totalSales: 125000,
  },
  {
    id: '2',
    name: 'North Station',
    address: '456 North Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    phone: '555-0456',
    manager: 'Jane Smith',
    status: 'active',
    pumpCount: 6,
    totalSales: 98000,
  },
  {
    id: '3',
    name: 'East Station',
    address: '789 East Blvd',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    phone: '555-0789',
    manager: 'Bob Johnson',
    status: 'maintenance',
    pumpCount: 4,
    totalSales: 67000,
  },
];

// Mock API hooks
vi.mock('@/hooks/api/useStations', () => ({
  useStations: () => ({
    data: mockStations,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreateStation: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useUpdateStation: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useDeleteStation: () => ({
    mutate: vi.fn(),
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

describe('StationsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display the page title', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('heading', { name: /stations/i })).toBeInTheDocument();
    });

    it('should display stations in a grid layout', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
        expect(screen.getByText('North Station')).toBeInTheDocument();
        expect(screen.getByText('East Station')).toBeInTheDocument();
      });
    });

    it('should show station details', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Springfield, IL 62701')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('8 pumps')).toBeInTheDocument();
    });

    it('should display action buttons', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('button', { name: /add station/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });
  });

  describe('when filtering and searching', () => {
    it('should search stations by name', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      await user.type(searchInput, 'Main');
      
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
        expect(screen.queryByText('North Station')).not.toBeInTheDocument();
        expect(screen.queryByText('East Station')).not.toBeInTheDocument();
      });
    });

    it('should filter by status', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'maintenance');
      
      await waitFor(() => {
        expect(screen.queryByText('Main Station')).not.toBeInTheDocument();
        expect(screen.queryByText('North Station')).not.toBeInTheDocument();
        expect(screen.getByText('East Station')).toBeInTheDocument();
      });
    });

    it('should filter by city', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const cityFilter = screen.getByRole('combobox', { name: /city/i });
      await user.selectOptions(cityFilter, 'Springfield');
      
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
        expect(screen.getByText('North Station')).toBeInTheDocument();
        expect(screen.getByText('East Station')).toBeInTheDocument();
      });
    });

    it('should clear all filters', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      // Apply filters
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      await user.type(searchInput, 'Main');
      
      const statusFilter = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusFilter, 'active');
      
      // Clear filters
      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText('Main Station')).toBeInTheDocument();
        expect(screen.getByText('North Station')).toBeInTheDocument();
        expect(screen.getByText('East Station')).toBeInTheDocument();
      });
    });
  });

  describe('when managing stations', () => {
    it('should open create station modal', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addButton);
      
      expect(screen.getByRole('dialog', { name: /create station/i })).toBeInTheDocument();
    });

    it('should create a new station', async () => {
      const mockCreate = vi.fn();
      vi.doMock('@/hooks/api/useStations', () => ({
        useCreateStation: () => ({
          mutate: mockCreate,
          isLoading: false,
          error: null,
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addButton);
      
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByRole('textbox', { name: /name/i });
      const addressInput = within(modal).getByRole('textbox', { name: /address/i });
      const cityInput = within(modal).getByRole('textbox', { name: /city/i });
      const submitButton = within(modal).getByRole('button', { name: /create/i });
      
      await user.type(nameInput, 'New Station');
      await user.type(addressInput, '999 New St');
      await user.type(cityInput, 'New City');
      await user.click(submitButton);
      
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'New Station',
        address: '999 New St',
        city: 'New City',
      });
    });

    it('should edit an existing station', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const stationCards = screen.getAllByTestId('station-card');
      const editButton = within(stationCards[0]).getByRole('button', { name: /edit/i });
      await user.click(editButton);
      
      expect(screen.getByRole('dialog', { name: /edit station/i })).toBeInTheDocument();
    });

    it('should delete a station with confirmation', async () => {
      const mockDelete = vi.fn();
      vi.doMock('@/hooks/api/useStations', () => ({
        useDeleteStation: () => ({
          mutate: mockDelete,
          isLoading: false,
          error: null,
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      const stationCards = screen.getAllByTestId('station-card');
      const deleteButton = within(stationCards[0]).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      const confirmDialog = screen.getByRole('dialog', { name: /confirm delete/i });
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);
      
      expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('should navigate to station details', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const stationCards = screen.getAllByTestId('station-card');
      const viewButton = within(stationCards[0]).getByRole('button', { name: /view details/i });
      await user.click(viewButton);
      
      expect(window.location.pathname).toBe('/stations/1');
    });
  });

  describe('when sorting', () => {
    it('should sort by name', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'name');
      
      const stationCards = screen.getAllByTestId('station-card');
      expect(within(stationCards[0]).getByText('East Station')).toBeInTheDocument();
      expect(within(stationCards[1]).getByText('Main Station')).toBeInTheDocument();
      expect(within(stationCards[2]).getByText('North Station')).toBeInTheDocument();
    });

    it('should sort by sales', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'sales');
      
      const stationCards = screen.getAllByTestId('station-card');
      expect(within(stationCards[0]).getByText('Main Station')).toBeInTheDocument();
      expect(within(stationCards[1]).getByText('North Station')).toBeInTheDocument();
      expect(within(stationCards[2]).getByText('East Station')).toBeInTheDocument();
    });

    it('should sort by pump count', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'pumps');
      
      const stationCards = screen.getAllByTestId('station-card');
      expect(within(stationCards[0]).getByText('Main Station')).toBeInTheDocument();
      expect(within(stationCards[1]).getByText('North Station')).toBeInTheDocument();
      expect(within(stationCards[2]).getByText('East Station')).toBeInTheDocument();
    });
  });

  describe('when handling errors', () => {
    it('should display error message when loading fails', () => {
      vi.doMock('@/hooks/api/useStations', () => ({
        useStations: () => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load stations'),
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/failed to load stations/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle create station errors', async () => {
      vi.doMock('@/hooks/api/useStations', () => ({
        useCreateStation: () => ({
          mutate: vi.fn(),
          isLoading: false,
          error: new Error('Failed to create station'),
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addButton);
      
      expect(screen.getByText(/failed to create station/i)).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('should show loading state', () => {
      vi.doMock('@/hooks/api/useStations', () => ({
        useStations: () => ({
          data: null,
          isLoading: true,
          error: null,
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/loading stations/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('station-skeleton')).toHaveLength(6);
    });

    it('should show loading state for actions', async () => {
      vi.doMock('@/hooks/api/useStations', () => ({
        useCreateStation: () => ({
          mutate: vi.fn(),
          isLoading: true,
          error: null,
        }),
      }));

      render(<StationsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add station/i });
      await user.click(addButton);
      
      const modal = screen.getByRole('dialog');
      const submitButton = within(modal).getByRole('button', { name: /creating/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper landmark structure', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('search')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /stations grid/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const addButton = screen.getByRole('button', { name: /add station/i });
      addButton.focus();
      
      expect(document.activeElement).toBe(addButton);
      
      await user.tab();
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(document.activeElement).toBe(refreshButton);
    });

    it('should announce updates to screen readers', async () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/stations updated/i);
      });
    });

    it('should have proper card accessibility', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const stationCards = screen.getAllByTestId('station-card');
      stationCards.forEach(card => {
        expect(card).toHaveAttribute('role', 'article');
        expect(card).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('responsive behavior', () => {
    it('should adapt grid for mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<StationsPage />, { wrapper: createWrapper() });
      
      const grid = screen.getByTestId('stations-grid');
      expect(grid).toHaveClass('mobile-grid');
    });

    it('should show list view on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByTestId('stations-list')).toBeInTheDocument();
    });
  });

  describe('data visualization', () => {
    it('should display sales charts', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      const chartToggle = screen.getByRole('button', { name: /show charts/i });
      fireEvent.click(chartToggle);
      
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
    });

    it('should show performance metrics', () => {
      render(<StationsPage />, { wrapper: createWrapper() });
      
      expect(screen.getByText(/total sales/i)).toBeInTheDocument();
      expect(screen.getByText(/average per station/i)).toBeInTheDocument();
      expect(screen.getByText(/total pumps/i)).toBeInTheDocument();
    });
  });
});
