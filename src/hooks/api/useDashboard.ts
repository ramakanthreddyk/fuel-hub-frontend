/**
 * @file useDashboard.ts
 * @description React Query hooks for dashboard API
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for dashboard
 */
import { useQuery } from '@tanstack/react-query';
import { dashboardService, SalesSummary, PaymentMethodBreakdown, FuelTypeBreakdown, DailySalesTrend, StationMetric } from '@/api/services/dashboardService';

/**
 * Hook to fetch sales summary for the dashboard
 * @param period Optional period (today, week, month, year)
 * @returns Query result with sales summary data
 */
export const useSalesSummary = (period: string = 'today') => {
  return useQuery({
    queryKey: ['sales-summary', period],
    queryFn: () => dashboardService.getSalesSummary(period),
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch payment method breakdown
 * @param period Optional period (today, week, month, year)
 * @returns Query result with payment method breakdown data
 */
export const usePaymentMethodBreakdown = (period: string = 'today') => {
  return useQuery({
    queryKey: ['payment-method-breakdown', period],
    queryFn: () => dashboardService.getPaymentMethodBreakdown(period),
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch fuel type breakdown
 * @param period Optional period (today, week, month, year)
 * @returns Query result with fuel type breakdown data
 */
export const useFuelTypeBreakdown = (period: string = 'today') => {
  return useQuery({
    queryKey: ['fuel-type-breakdown', period],
    queryFn: () => dashboardService.getFuelTypeBreakdown(period),
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch daily sales trend
 * @param days Number of days to include
 * @returns Query result with daily sales trend data
 */
export const useDailySalesTrend = (days: number = 7) => {
  return useQuery({
    queryKey: ['daily-sales-trend', days],
    queryFn: () => dashboardService.getDailySalesTrend(days),
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch station metrics
 * @returns Query result with station metrics data
 */
export const useStationMetrics = () => {
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: () => dashboardService.getStationMetrics(),
    staleTime: 300000, // 5 minutes
  });
};