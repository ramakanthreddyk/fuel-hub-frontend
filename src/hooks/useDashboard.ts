
import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardFilters } from '@/api/services/dashboardService';

export const useSalesSummary = (range: string = 'monthly', filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['sales-summary', range, filters],
    queryFn: () => dashboardService.getSalesSummary(range, filters),
    retry: 1,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });
};

export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['payment-method-breakdown', filters],
    queryFn: () => dashboardService.getPaymentMethodBreakdown(filters),
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['fuel-type-breakdown', filters],
    queryFn: () => dashboardService.getFuelTypeBreakdown(filters),
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

export const useTopCreditors = (limit: number = 5, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['top-creditors', limit, filters],
    queryFn: () => dashboardService.getTopCreditors(limit),
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

export const useDailySalesTrend = (days: number = 7, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['daily-sales-trend', days, filters],
    queryFn: () => dashboardService.getDailySalesTrend(days, filters),
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

export const useStationMetrics = () => {
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: () => dashboardService.getStationMetrics(),
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

// Simplified hooks - remove non-working analytics
export const useAnalyticsDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => dashboardService.getSalesSummary('monthly'),
    retry: 1,
    staleTime: 300000, // 5 minutes
    enabled,
    refetchOnWindowFocus: true,
  });
};

export const useAdminDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getSalesSummary('daily'),
    retry: 1,
    staleTime: 300000,
    enabled,
    refetchOnWindowFocus: true,
  });
};
