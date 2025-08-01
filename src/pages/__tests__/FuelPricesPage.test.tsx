/**
 * @file pages/__tests__/FuelPricesPage.test.tsx
 * @description Tests for FuelPricesPage component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import FuelPricesPage from '../dashboard/FuelPricesPage';

// Mock the hooks
vi.mock('@/hooks/api/useFuelPrices', () => ({
  useFuelPrices: vi.fn(),
  useUpdateFuelPrice: vi.fn(),
  useCreateFuelPrice: vi.fn(),
  useFuelPriceHistory: vi.fn(),
}));

vi.mock('@/hooks/api/useStations', () => ({
  useStations: vi.fn(),
}));

const mockUseFuelPrices = vi.mocked(await import('@/hooks/api/useFuelPrices')).useFuelPrices;
const mockUseUpdateFuelPrice = vi.mocked(await import('@/hooks/api/useFuelPrices')).useUpdateFuelPrice;
const mockUseCreateFuelPrice = vi.mocked(await import('@/hooks/api/useFuelPrices')).useCreateFuelPrice;
const mockUseFuelPriceHistory = vi.mocked(await import('@/hooks/api/useFuelPrices')).useFuelPriceHistory;
const mockUseStations = vi.mocked(await import('@/hooks/api/useStations')).useStations;

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

const mockFuelPrices = [
  {
    id: 'price-1',
    stationId: 'station-1',
    fuelType: 'petrol',
    price: 102.50,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'price-2',
    stationId: 'station-1',
    fuelType: 'diesel',
    price: 89.75,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'price-3',
    stationId: 'station-2',
    fuelType: 'petrol',
    price: 103.00,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    status: 'active',
    pumpCount: 8,
  },
  {
    id: 'station-2',
    name: 'Highway Station',
    address: '456 Highway Road',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    status: 'active',
    pumpCount: 6,
  },
];

const mockPriceHistory = [
  {
    id: 'history-1',
    fuelType: 'petrol',
    price: 100.00,
    effectiveDate: '2023-12-01',
    stationId: 'station-1',
  },
  {
    id: 'history-2',
    fuelType: 'petrol',
    price: 101.25,
    effectiveDate: '2023-12-15',
    stationId: 'station-1',
  },
  {
    id: 'history-3',
    fuelType: 'petrol',
    price: 102.50,
    effectiveDate: '2024-01-01',
    stationId: 'station-1',
  },
];

describe('FuelPricesPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseFuelPrices.mockReturnValue({
      data: mockFuelPrices,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseStations.mockReturnValue({
      data: mockStations,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseFuelPriceHistory.mockReturnValue({
      data: mockPriceHistory,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseUpdateFuelPrice.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    mockUseCreateFuelPrice.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      isSuccess: false,
    });
  });

  it('should render fuel prices page with header', () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Fuel Prices')).toBeInTheDocument();
    expect(screen.getByText(/manage fuel prices across all stations/i)).toBeInTheDocument();
  });

  it('should display fuel prices table', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByText('Station')).toBeInTheDocument();
    expect(screen.getByText('Fuel Type')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Effective Date')).toBeInTheDocument();
  });

  it('should show fuel price data in table', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Main Station')).toBeInTheDocument();
      expect(screen.getByText('Petrol')).toBeInTheDocument();
      expect(screen.getByText('₹102.50')).toBeInTheDocument();
      expect(screen.getByText('Diesel')).toBeInTheDocument();
      expect(screen.getByText('₹89.75')).toBeInTheDocument();
    });
  });

  it('should filter prices by station', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const stationFilter = screen.getByTestId('station-filter');
    await user.click(stationFilter);

    const mainStationOption = screen.getByText('Main Station');
    await user.click(mainStationOption);

    expect(mockUseFuelPrices).toHaveBeenCalledWith({ stationId: 'station-1' });
  });

  it('should filter prices by fuel type', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const fuelTypeFilter = screen.getByTestId('fuel-type-filter');
    await user.click(fuelTypeFilter);

    const petrolOption = screen.getByText('Petrol');
    await user.click(petrolOption);

    expect(mockUseFuelPrices).toHaveBeenCalledWith({ fuelType: 'petrol' });
  });

  it('should open update price dialog when edit button is clicked', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      const editButtons = screen.getAllByTestId('edit-price-button');
      expect(editButtons[0]).toBeInTheDocument();
    });

    const editButton = screen.getAllByTestId('edit-price-button')[0];
    await user.click(editButton);

    expect(screen.getByTestId('update-price-dialog')).toBeInTheDocument();
    expect(screen.getByText('Update Fuel Price')).toBeInTheDocument();
  });

  it('should update fuel price', async () => {
    const mockMutate = vi.fn();
    mockUseUpdateFuelPrice.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const editButton = screen.getAllByTestId('edit-price-button')[0];
    await user.click(editButton);

    const priceInput = screen.getByLabelText(/new price/i);
    await user.clear(priceInput);
    await user.type(priceInput, '105.00');

    const updateButton = screen.getByRole('button', { name: /update price/i });
    await user.click(updateButton);

    expect(mockMutate).toHaveBeenCalledWith({
      id: 'price-1',
      price: 105.00,
      effectiveDate: expect.any(String),
    });
  });

  it('should open create price dialog when add button is clicked', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add fuel price/i });
    await user.click(addButton);

    expect(screen.getByTestId('create-price-dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Fuel Price')).toBeInTheDocument();
  });

  it('should create new fuel price', async () => {
    const mockMutate = vi.fn();
    mockUseCreateFuelPrice.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add fuel price/i });
    await user.click(addButton);

    const stationSelect = screen.getByTestId('station-select');
    await user.click(stationSelect);
    await user.click(screen.getByText('Main Station'));

    const fuelTypeSelect = screen.getByTestId('fuel-type-select');
    await user.click(fuelTypeSelect);
    await user.click(screen.getByText('Premium'));

    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, '110.00');

    const createButton = screen.getByRole('button', { name: /create price/i });
    await user.click(createButton);

    expect(mockMutate).toHaveBeenCalledWith({
      stationId: 'station-1',
      fuelType: 'premium',
      price: 110.00,
      effectiveDate: expect.any(String),
    });
  });

  it('should show price history chart', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const historyTab = screen.getByText('Price History');
    await user.click(historyTab);

    await waitFor(() => {
      expect(screen.getByTestId('price-history-chart')).toBeInTheDocument();
    });

    expect(screen.getByText('Price Trends')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseFuelPrices.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuel-prices-loading')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseFuelPrices.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load fuel prices'),
      refetch: vi.fn(),
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuel-prices-error')).toBeInTheDocument();
    expect(screen.getByText(/failed to load fuel prices/i)).toBeInTheDocument();
  });

  it('should handle empty state', () => {
    mockUseFuelPrices.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuel-prices-empty')).toBeInTheDocument();
    expect(screen.getByText(/no fuel prices found/i)).toBeInTheDocument();
  });

  it('should validate price input', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add fuel price/i });
    await user.click(addButton);

    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, '-10');

    const createButton = screen.getByRole('button', { name: /create price/i });
    await user.click(createButton);

    expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
  });

  it('should show bulk update option', () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('button', { name: /bulk update/i })).toBeInTheDocument();
  });

  it('should handle bulk price update', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const bulkUpdateButton = screen.getByRole('button', { name: /bulk update/i });
    await user.click(bulkUpdateButton);

    expect(screen.getByTestId('bulk-update-dialog')).toBeInTheDocument();
    expect(screen.getByText('Bulk Price Update')).toBeInTheDocument();
  });

  it('should export price data', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const exportButton = screen.getByRole('button', { name: /export/i });
    await user.click(exportButton);

    // Mock download functionality
    expect(exportButton).toBeInTheDocument();
  });

  it('should search prices by station name', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search stations/i);
    await user.type(searchInput, 'main');

    expect(mockUseFuelPrices).toHaveBeenCalledWith({ search: 'main' });
  });

  it('should sort prices by different columns', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const priceHeader = screen.getByText('Price');
    await user.click(priceHeader);

    expect(screen.getByTestId('sort-indicator')).toBeInTheDocument();
  });

  it('should show price comparison between stations', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const comparisonTab = screen.getByText('Price Comparison');
    await user.click(comparisonTab);

    await waitFor(() => {
      expect(screen.getByTestId('price-comparison-chart')).toBeInTheDocument();
    });
  });

  it('should be accessible', () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    // Check main heading
    expect(screen.getByRole('heading', { name: /fuel prices/i })).toBeInTheDocument();

    // Check table accessibility
    const table = screen.getByRole('table');
    expect(table).toHaveAccessibleName();

    // Check button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should handle keyboard navigation', async () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /add fuel price/i });
    
    // Focus and activate with keyboard
    addButton.focus();
    fireEvent.keyDown(addButton, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('create-price-dialog')).toBeInTheDocument();
    });
  });

  it('should refresh data when refresh button is clicked', async () => {
    const mockRefetch = vi.fn();
    mockUseFuelPrices.mockReturnValue({
      data: mockFuelPrices,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<FuelPricesPage />, { wrapper: createWrapper() });

    const refreshButton = screen.getByTestId('refresh-button');
    await user.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should show price alerts and notifications', () => {
    render(<FuelPricesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('price-alerts-panel')).toBeInTheDocument();
    expect(screen.getByText(/price alerts/i)).toBeInTheDocument();
  });
});
