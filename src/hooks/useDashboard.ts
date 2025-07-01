
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useSalesSummary = (range: string = 'monthly', filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['sales-summary', range, filters],
    queryFn: () => dashboardApi.getSalesSummary(range, filters),
    retry: 1,
    staleTime: 60000, // 1 minute
  });
};

export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['payment-methods', filters],
    queryFn: () => dashboardApi.getPaymentMethodBreakdown(filters),
    retry: 1,
    staleTime: 60000,
  });
};

export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['fuel-breakdown', filters],
    queryFn: () => dashboardApi.getFuelTypeBreakdown(filters),
    retry: 1,
    staleTime: 60000,
  });
};

export const useTopCreditors = (limit: number = 5, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['top-creditors', limit, filters],
    queryFn: () => dashboardApi.getTopCreditors(limit),
    retry: 1,
    staleTime: 60000,
  });
};

export const useDailySalesTrend = (days: number = 7, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['sales-trend', days, filters],
    queryFn: () => dashboardApi.getDailySalesTrend(days, filters),
    retry: 1,
    staleTime: 60000,
  });
};

export const useStationMetrics = () => {
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: () => dashboardApi.getStationMetrics(),
    retry: 1,
    staleTime: 60000,
  });
};
