/**
 * @file components/dashboard/__tests__/SalesSummaryCard.test.tsx
 * @description Tests for SalesSummaryCard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SalesSummaryCard } from '../SalesSummaryCard';

// Mock the hooks
vi.mock('@/hooks/useDashboard', () => ({
  useSalesData: vi.fn(),
}));

vi.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}));

const mockUseSalesData = vi.mocked(await import('@/hooks/useDashboard')).useSalesData;

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
  yesterdaySales: 12000,
  weekSales: 85000,
  monthSales: 350000,
  salesGrowth: 12.5,
  transactionCount: 1250,
  averageTransaction: 100,
  peakHour: '14:00',
  topFuelType: 'Premium',
};

describe('SalesSummaryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseSalesData.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('sales-summary-loading')).toBeInTheDocument();
    expect(screen.getByText(/loading sales data/i)).toBeInTheDocument();
  });

  it('should render sales data correctly', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('sales-summary-card')).toBeInTheDocument();
    });

    // Check main sales figures
    expect(screen.getByText('₹1,25,000')).toBeInTheDocument(); // Total sales
    expect(screen.getByText('₹15,000')).toBeInTheDocument(); // Today's sales
    expect(screen.getByText('1,250')).toBeInTheDocument(); // Transaction count
    expect(screen.getByText('₹100')).toBeInTheDocument(); // Average transaction
  });

  it('should display growth percentage correctly', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    // Should show growth indicator
    expect(screen.getByTestId('growth-indicator')).toHaveClass('text-green-600');
  });

  it('should display negative growth correctly', async () => {
    const negativeGrowthData = {
      ...mockSalesData,
      salesGrowth: -5.2,
    };

    mockUseSalesData.mockReturnValue({
      data: negativeGrowthData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('-5.2%')).toBeInTheDocument();
    });

    // Should show decline indicator
    expect(screen.getByTestId('growth-indicator')).toHaveClass('text-red-600');
  });

  it('should render error state', () => {
    mockUseSalesData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch sales data'),
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('sales-summary-error')).toBeInTheDocument();
    expect(screen.getByText(/failed to load sales data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle retry on error', async () => {
    const mockRefetch = vi.fn();
    mockUseSalesData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch sales data'),
      refetch: mockRefetch,
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    retryButton.click();

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should apply filters correctly', () => {
    const filters = { stationId: 'station-1', dateRange: 'week' };
    
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard filters={filters} />, { wrapper: createWrapper() });

    expect(mockUseSalesData).toHaveBeenCalledWith(filters);
  });

  it('should format currency correctly', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Check Indian Rupee formatting
      expect(screen.getByText('₹1,25,000')).toBeInTheDocument();
      expect(screen.getByText('₹15,000')).toBeInTheDocument();
    });
  });

  it('should show peak hour information', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/peak hour/i)).toBeInTheDocument();
      expect(screen.getByText('14:00')).toBeInTheDocument();
    });
  });

  it('should show top fuel type', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/top fuel/i)).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });
  });

  it('should handle empty data gracefully', async () => {
    mockUseSalesData.mockReturnValue({
      data: {
        totalSales: 0,
        todaySales: 0,
        yesterdaySales: 0,
        weekSales: 0,
        monthSales: 0,
        salesGrowth: 0,
        transactionCount: 0,
        averageTransaction: 0,
        peakHour: null,
        topFuelType: null,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('₹0')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });
  });

  it('should be accessible', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard />, { wrapper: createWrapper() });

    await waitFor(() => {
      const card = screen.getByTestId('sales-summary-card');
      expect(card).toHaveAttribute('role', 'region');
      expect(card).toHaveAttribute('aria-label', 'Sales Summary');
    });

    // Check for proper heading structure
    expect(screen.getByRole('heading', { name: /sales summary/i })).toBeInTheDocument();
  });

  it('should support custom className', () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard className="custom-class" />, { wrapper: createWrapper() });

    expect(screen.getByTestId('sales-summary-card')).toHaveClass('custom-class');
  });

  it('should refresh data on mount', () => {
    const mockRefetch = vi.fn();
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SalesSummaryCard refreshOnMount />, { wrapper: createWrapper() });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should handle real-time updates', async () => {
    const { rerender } = render(<SalesSummaryCard />, { wrapper: createWrapper() });

    // Initial data
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    rerender(<SalesSummaryCard />);

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

    rerender(<SalesSummaryCard />);

    await waitFor(() => {
      expect(screen.getByText('₹1,30,000')).toBeInTheDocument();
    });
  });

  it('should show comparison with previous period', async () => {
    mockUseSalesData.mockReturnValue({
      data: mockSalesData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SalesSummaryCard showComparison />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/vs yesterday/i)).toBeInTheDocument();
      expect(screen.getByText('₹12,000')).toBeInTheDocument(); // Yesterday's sales
    });
  });
});
