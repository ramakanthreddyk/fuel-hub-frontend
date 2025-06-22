
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

export const useSalesSummary = (range: string = 'monthly') => {
  return useQuery({
    queryKey: ['dashboard', 'sales-summary', range],
    queryFn: () => dashboardApi.getSalesSummary(range),
  });
};

export const usePaymentMethodBreakdown = () => {
  return useQuery({
    queryKey: ['dashboard', 'payment-methods'],
    queryFn: dashboardApi.getPaymentMethodBreakdown,
  });
};

export const useFuelTypeBreakdown = () => {
  return useQuery({
    queryKey: ['dashboard', 'fuel-breakdown'],
    queryFn: dashboardApi.getFuelTypeBreakdown,
  });
};

export const useTopCreditors = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'top-creditors', limit],
    queryFn: () => dashboardApi.getTopCreditors(limit),
  });
};

export const useDailySalesTrend = (days: number = 7) => {
  return useQuery({
    queryKey: ['dashboard', 'sales-trend', days],
    queryFn: () => dashboardApi.getDailySalesTrend(days),
  });
};
