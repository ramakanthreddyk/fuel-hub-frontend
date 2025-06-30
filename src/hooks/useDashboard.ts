
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useSalesSummary = (range: string = 'monthly', filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'sales-summary', range, filters],
    queryFn: () => dashboardApi.getSalesSummary(range, filters),
  });
};

export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'payment-methods', filters],
    queryFn: () => dashboardApi.getPaymentMethodBreakdown(filters),
  });
};

export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'fuel-breakdown', filters],
    queryFn: () => dashboardApi.getFuelTypeBreakdown(filters),
  });
};

export const useTopCreditors = (limit: number = 5, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'top-creditors', limit, filters],
    queryFn: () => dashboardApi.getTopCreditors(limit),
  });
};

export const useDailySalesTrend = (days: number = 7, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'sales-trend', days, filters],
    queryFn: () => dashboardApi.getDailySalesTrend(days, filters),
  });
};

export const useStationMetrics = () => {
  return useQuery({
    queryKey: ['stations', 'metrics'],
    queryFn: dashboardApi.getStationMetrics,
  });
};
