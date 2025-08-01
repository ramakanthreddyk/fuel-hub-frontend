/**
 * @file components/dashboard/__tests__/ModernSalesSummaryCard.test.tsx
 * @description Tests for ModernSalesSummaryCard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModernSalesSummaryCard } from '../ModernSalesSummaryCard';

// Mock the hooks
vi.mock('@/hooks/useDashboard', () => ({
  useSalesData: vi.fn(),
  useSalesMetrics: vi.fn(),
}));

vi.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}));

const mockUseSalesData = vi.mocked(await import('@/hooks/useDashboard')).useSalesData;
const mockUseSalesMetrics = vi.mocked(await import('@/hooks/useDashboard')).useSalesMetrics;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const mockSalesData = {
  totalSales: 125000,
  todaySales: 15000,
  weekSales: 85000,
  monthSales: 350000,
  salesGrowth: 12.5,
  transactionCount: 1250,
  averageTransaction: 100,
  hourlyData: [
    { hour: '00:00', sales: 500 },
    { hour: '01:00', sales: 300 },
    { hour: '02:00', sales: 200 },
    { hour: '03:00', sales: 150 },
    { hour: '04:00', sales: 100 },
    { hour: '05:00', sales: 200 },
    { hour: '06:00', sales: 800 },
    { hour: '07:00', sales: 1200 },
    { hour: '08:00', sales: 1500 },
    { hour: '09:00', sales: 1800 },
    { hour: '10:00', sales: 2000 },
    { hour: '11:00', sales: 2200 },
    { hour: '12:00', sales: 2500 },
    { hour: '13:00', sales: 2800 },
    { hour: '14:00', sales: 3000 },
    { hour: '15:00', sales: 2700 },
    { hour: '16:00', sales: 2400 },
    { hour: '17:00', sales: 2100 },
    { hour: '18:00', sales: 1800 },
    { hour: '19:00', sales: 1500 },
    { hour: '20:00', sales: 1200 },
    { hour: '21:00', sales: 900 },
    { hour: '22:00', sales: 600 },
    { hour: '23:00', sales: 400 },
  ],
};

const mockMetrics = {
  peakHour: '14:00',
  peakSales: 3000,
  averageHourlySales: 625,
  salesTrend: 'increasing',
  efficiency: 85,
};

describe('ModernSalesSummaryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state with skeleton', () => {
    mockUseSalesData.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('modern-sales-summary-loading')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(4); // Multiple skeleton elements
  });

  it('should render sales data with modern design', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('modern-sales-summary-card')).toBeInTheDocument();
    });

    // Check main metrics
    expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
    expect(screen.getByText('₹15,000')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('should display hourly sales chart', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('hourly-sales-chart')).toBeInTheDocument();
    });

    // Check chart data points
    expect(screen.getByText('Peak: 14:00')).toBeInTheDocument();
    expect(screen.getByText('₹3,000')).toBeInTheDocument();
  });

  it('should show interactive tooltips on chart hover', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const chart = screen.getByTestId('hourly-sales-chart');
      expect(chart).toBeInTheDocument();
    });

    // Simulate hover on chart point
    const chartPoint = screen.getByTestId('chart-point-14');
    fireEvent.mouseEnter(chartPoint);

    await waitFor(() => {
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
      expect(screen.getByText('14:00 - ₹3,000')).toBeInTheDocument();
    });
  });

  it('should display sales trend indicators', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('trend-indicator')).toBeInTheDocument();
      expect(screen.getByText('Increasing')).toBeInTheDocument();
    });

    // Check trend icon
    expect(screen.getByTestId('trend-up-icon')).toBeInTheDocument();
  });

  it('should handle decreasing trend', async () => {
    const decreasingMetrics = {
      ...mockMetrics,
      salesTrend: 'decreasing',
    };

    mockUseSalesData.mockReturnValue({
      data: { ...mockSalesData, salesGrowth: -8.3 },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: decreasingMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Decreasing')).toBeInTheDocument();
      expect(screen.getByText('-8.3%')).toBeInTheDocument();
    });

    // Check trend icon
    expect(screen.getByTestId('trend-down-icon')).toBeInTheDocument();
  });

  it('should show efficiency metrics', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Efficiency')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    // Check efficiency progress bar
    expect(screen.getByTestId('efficiency-progress')).toBeInTheDocument();
  });

  it('should handle error state gracefully', () => {
    mockUseSalesData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch sales data'),
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch metrics'),
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('modern-sales-summary-error')).toBeInTheDocument();
    expect(screen.getByText(/failed to load sales data/i)).toBeInTheDocument();
  });

  it('should support time period filtering', async () => {
    const filters = { period: 'week', stationId: 'station-1' };

    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard filters={filters} />, { wrapper: createWrapper() });

    expect(mockUseSalesData).toHaveBeenCalledWith(filters);
    expect(mockUseSalesMetrics).toHaveBeenCalledWith(filters);
  });

  it('should be responsive on mobile', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const card = screen.getByTestId('modern-sales-summary-card');
      expect(card).toHaveClass('mobile-responsive');
    });
  });

  it('should support dark mode', async () => {
    // Mock dark mode
    document.documentElement.classList.add('dark');

    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const card = screen.getByTestId('modern-sales-summary-card');
      expect(card).toHaveClass('dark:bg-gray-800');
    });

    // Cleanup
    document.documentElement.classList.remove('dark');
  });

  it('should handle real-time updates with animations', async () => {
    const { rerender } = render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    // Initial data
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    rerender(<ModernSalesSummaryCard />);

    await waitFor(() => {
      expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
    });

    // Updated data
    const updatedData = { ...mockSalesData, totalSales: 130000 };
    mockUseSalesData.mockReturnValue({
      data: updatedData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    rerender(<ModernSalesSummaryCard />);

    await waitFor(() => {
      expect(screen.getByText('₹1,30,000')).toBeInTheDocument();
    });

    // Check for update animation
    expect(screen.getByTestId('value-update-animation')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const card = screen.getByTestId('modern-sales-summary-card');
      expect(card).toHaveAttribute('role', 'region');
      expect(card).toHaveAttribute('aria-label', 'Modern Sales Summary Dashboard');
    });

    // Check chart accessibility
    const chart = screen.getByTestId('hourly-sales-chart');
    expect(chart).toHaveAttribute('role', 'img');
    expect(chart).toHaveAttribute('aria-label', 'Hourly sales data chart');
  });

  it('should support keyboard navigation', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseSalesMetrics.mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ModernSalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const chart = screen.getByTestId('hourly-sales-chart');
      expect(chart).toBeInTheDocument();
    });

    // Test keyboard navigation on chart
    const chartPoint = screen.getByTestId('chart-point-14');
    chartPoint.focus();
    
    fireEvent.keyDown(chartPoint, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
    });
  });
});
