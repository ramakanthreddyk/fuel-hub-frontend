
import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardFilters } from '@/api/services/dashboardService';



export const useSalesSummary = (range: string = 'monthly', filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['sales-summary', range, filters],
    queryFn: () => dashboardService.getSalesSummary(range, filters),
    retry: 1,
    staleTime: 60000, // 1 minute
  });
};

export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['payment-methods', filters],
    queryFn: () => dashboardService.getPaymentMethodBreakdown(filters),
    retry: 1,
    staleTime: 60000,
  });
};

export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['fuel-breakdown', filters],
    queryFn: () => dashboardService.getFuelTypeBreakdown(filters),
    retry: 1,
    staleTime: 60000,
  });
};

export const useTopCreditors = (limit: number = 5, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['top-creditors', limit, filters],
    queryFn: () => dashboardService.getTopCreditors(limit),
    retry: 1,
    staleTime: 60000,
  });
};

export const useDailySalesTrend = (days: number = 7, filters: DashboardFilters = {}) => {
  return useQuery({
    queryKey: ['sales-trend', days, filters],
    queryFn: () => dashboardService.getDailySalesTrend(days, filters),
    retry: 1,
    staleTime: 60000,
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
  });
};

export const useAdminDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getSalesSummary('daily'),
    retry: 1,
    staleTime: 300000,
    enabled,
  });
};
