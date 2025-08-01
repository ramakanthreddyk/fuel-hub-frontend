/**
 * @file components/stations/__tests__/StationCard.test.tsx
 * @description Tests for StationCard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { StationCard } from '../StationCard';

// Mock the hooks
vi.mock('@/hooks/api/usePumps', () => ({
  usePumps: vi.fn(),
}));

vi.mock('@/hooks/api/useFuelPrices', () => ({
  useFuelPrices: vi.fn(),
}));

vi.mock('@/hooks/api/useDashboard', () => ({
  useStationMetrics: vi.fn(),
}));

const mockUsePumps = vi.mocked(await import('@/hooks/api/usePumps')).usePumps;
const mockUseFuelPrices = vi.mocked(await import('@/hooks/api/useFuelPrices')).useFuelPrices;
const mockUseStationMetrics = vi.mocked(await import('@/hooks/api/useDashboard')).useStationMetrics;

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

const mockStation = {
  id: 'station-1',
  name: 'Main Station',
  address: '123 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400001',
  status: 'active' as const,
  pumpCount: 8,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPumps = [
  {
    id: 'pump-1',
    name: 'Pump 1',
    serialNumber: 'SN001',
    stationId: 'station-1',
    status: 'active' as const,
    nozzleCount: 4,
  },
  {
    id: 'pump-2',
    name: 'Pump 2',
    serialNumber: 'SN002',
    stationId: 'station-1',
    status: 'maintenance' as const,
    nozzleCount: 2,
  },
];

const mockFuelPrices = [
  {
    id: 'price-1',
    stationId: 'station-1',
    fuelType: 'petrol',
    price: 102.50,
    effectiveDate: '2024-01-01',
  },
  {
    id: 'price-2',
    stationId: 'station-1',
    fuelType: 'diesel',
    price: 89.75,
    effectiveDate: '2024-01-01',
  },
];

const mockMetrics = {
  todaySales: 25000,
  todayTransactions: 150,
  activePumps: 7,
  totalPumps: 8,
  efficiency: 87.5,
};

describe('StationCard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUsePumps.mockReturnValue({
      data: mockPumps,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseFuelPrices.mockReturnValue({
      data: mockFuelPrices,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseStationMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('should render station information correctly', () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText('Main Station')).toBeInTheDocument();
    expect(screen.getByText('123 Main Street')).toBeInTheDocument();
    expect(screen.getByText('Mumbai, Maharashtra 400001')).toBeInTheDocument();
    expect(screen.getByText('8 Pumps')).toBeInTheDocument();
  });

  it('should display station status correctly', () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const statusIndicator = screen.getByTestId('station-status-indicator');
    expect(statusIndicator).toHaveClass('bg-green-500');
    expect(statusIndicator).toHaveAttribute('aria-label', 'Station status: active');
  });

  it('should show maintenance status', () => {
    const maintenanceStation = { ...mockStation, status: 'maintenance' as const };
    
    render(<StationCard station={maintenanceStation} />, { wrapper: createWrapper() });

    const statusIndicator = screen.getByTestId('station-status-indicator');
    expect(statusIndicator).toHaveClass('bg-orange-500');
    expect(statusIndicator).toHaveAttribute('aria-label', 'Station status: maintenance');
  });

  it('should show inactive status', () => {
    const inactiveStation = { ...mockStation, status: 'inactive' as const };
    
    render(<StationCard station={inactiveStation} />, { wrapper: createWrapper() });

    const statusIndicator = screen.getByTestId('station-status-indicator');
    expect(statusIndicator).toHaveClass('bg-red-500');
    expect(statusIndicator).toHaveAttribute('aria-label', 'Station status: inactive');
  });

  it('should display fuel prices', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('₹102.50')).toBeInTheDocument(); // Petrol price
      expect(screen.getByText('₹89.75')).toBeInTheDocument(); // Diesel price
    });

    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('Diesel')).toBeInTheDocument();
  });

  it('should show loading state for fuel prices', () => {
    mockUseFuelPrices.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('fuel-prices-loading')).toBeInTheDocument();
  });

  it('should handle fuel prices error', () => {
    mockUseFuelPrices.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load prices'),
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText(/prices unavailable/i)).toBeInTheDocument();
  });

  it('should display station metrics on hover', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const card = screen.getByTestId('station-card');
    
    await user.hover(card);

    await waitFor(() => {
      expect(screen.getByText('₹25,000')).toBeInTheDocument(); // Today's sales
      expect(screen.getByText('150')).toBeInTheDocument(); // Transactions
      expect(screen.getByText('7/8')).toBeInTheDocument(); // Active pumps
    });
  });

  it('should show pump status breakdown', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('7 Active')).toBeInTheDocument();
      expect(screen.getByText('1 Maintenance')).toBeInTheDocument();
    });
  });

  it('should handle click to navigate to station details', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const card = screen.getByTestId('station-card');
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/stations/station-1');
  });

  it('should show station visual representation', () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('station-visual')).toBeInTheDocument();
    expect(screen.getByText('Main Station')).toBeInTheDocument();
  });

  it('should handle loading state for pumps', () => {
    mockUsePumps.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('pumps-loading')).toBeInTheDocument();
  });

  it('should handle pumps error state', () => {
    mockUsePumps.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load pumps'),
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText(/pump data unavailable/i)).toBeInTheDocument();
  });

  it('should show efficiency indicator', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('87.5%')).toBeInTheDocument();
      expect(screen.getByText('Efficiency')).toBeInTheDocument();
    });

    const efficiencyBar = screen.getByTestId('efficiency-progress');
    expect(efficiencyBar).toHaveStyle('width: 87.5%');
  });

  it('should support keyboard navigation', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const card = screen.getByTestId('station-card');
    
    // Focus the card
    card.focus();
    expect(document.activeElement).toBe(card);

    // Press Enter to navigate
    fireEvent.keyDown(card, { key: 'Enter' });
    
    // Should trigger navigation (mocked)
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should be accessible', () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const card = screen.getByTestId('station-card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('aria-label', 'Station: Main Station');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should show hover effects', async () => {
    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    const card = screen.getByTestId('station-card');
    
    await user.hover(card);

    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:scale-[1.02]');
  });

  it('should handle empty fuel prices', () => {
    mockUseFuelPrices.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText(/no fuel prices available/i)).toBeInTheDocument();
  });

  it('should handle empty pumps data', () => {
    mockUsePumps.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText('0 Active')).toBeInTheDocument();
    expect(screen.getByText('0 Maintenance')).toBeInTheDocument();
  });

  it('should support custom className', () => {
    render(
      <StationCard station={mockStation} className="custom-class" />, 
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('station-card')).toHaveClass('custom-class');
  });

  it('should handle station with no address', () => {
    const stationNoAddress = {
      ...mockStation,
      address: '',
      city: '',
      state: '',
      zipCode: '',
    };

    render(<StationCard station={stationNoAddress} />, { wrapper: createWrapper() });

    expect(screen.getByText('Main Station')).toBeInTheDocument();
    expect(screen.getByText(/address not available/i)).toBeInTheDocument();
  });

  it('should show real-time updates', async () => {
    const { rerender } = render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    // Initial metrics
    await waitFor(() => {
      expect(screen.getByText('₹25,000')).toBeInTheDocument();
    });

    // Updated metrics
    const updatedMetrics = { ...mockMetrics, todaySales: 30000 };
    mockUseStationMetrics.mockReturnValue({
      data: updatedMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    rerender(<StationCard station={mockStation} />);

    await waitFor(() => {
      expect(screen.getByText('₹30,000')).toBeInTheDocument();
    });
  });

  it('should handle metrics loading state', () => {
    mockUseStationMetrics.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('metrics-loading')).toBeInTheDocument();
  });

  it('should handle metrics error state', () => {
    mockUseStationMetrics.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load metrics'),
      refetch: vi.fn(),
    });

    render(<StationCard station={mockStation} />, { wrapper: createWrapper() });

    expect(screen.getByText(/metrics unavailable/i)).toBeInTheDocument();
  });
});
