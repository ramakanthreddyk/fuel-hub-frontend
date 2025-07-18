
/**
 * @file useDashboard.ts
 * @description React Query hooks for dashboard API
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for dashboard
 */
import { useQuery } from '@tanstack/react-query';
import { dashboardService, SalesSummary, PaymentMethodBreakdown, FuelTypeBreakdown, DailySalesTrend, StationMetric, DashboardFilters } from '@/api/services/dashboardService';
import { useErrorHandler } from '../useErrorHandler';

/**
 * Hook to fetch sales summary for the dashboard
 * @param period Optional period (today, week, month, year)
 * @param filters Optional dashboard filters
 * @returns Query result with sales summary data
 */
export const useSalesSummary = (period: string = 'today', filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['sales-summary', period, filters],
    queryFn: () => dashboardService.getSalesSummary(period, filters),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch sales summary.');
    },
  });
};

/**
 * Hook to fetch payment method breakdown
 * @param filters Optional dashboard filters
 * @returns Query result with payment method breakdown data
 */
export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['payment-method-breakdown', filters],
    queryFn: () => dashboardService.getPaymentMethodBreakdown(filters),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch payment method breakdown.');
    },
  });
};

/**
 * Hook to fetch fuel type breakdown
 * @param filters Optional dashboard filters
 * @returns Query result with fuel type breakdown data
 */
export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['fuel-type-breakdown', filters],
    queryFn: () => dashboardService.getFuelTypeBreakdown(filters),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch fuel type breakdown.');
    },
  });
};

/**
 * Hook to fetch daily sales trend
 * @param days Number of days to include
 * @returns Query result with daily sales trend data
 */
export const useDailySalesTrend = (days: number = 7) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['daily-sales-trend', days],
    queryFn: () => dashboardService.getDailySalesTrend(days),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch daily sales trend.');
    },
  });
};

/**
 * Hook to fetch station metrics
 * @returns Query result with station metrics data
 */
export const useStationMetrics = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: () => dashboardService.getStationMetrics(),
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch station metrics.');
    },
  });
};
