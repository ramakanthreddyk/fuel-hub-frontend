
/**
 * @file useDashboard.ts
 * @description React Query hooks for dashboard API
 */
import { useQuery } from '@tanstack/react-query';
import { useErrorHandler } from '../useErrorHandler';

// Types for dashboard data
export interface SalesSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  growthPercentage: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  percentage: number;
}

export interface FuelTypeBreakdown {
  fuelType: string;
  volume: number;
  amount: number;
}

export interface DailySalesTrend {
  date: string;
  amount: number;
  volume: number;
}

export interface StationMetric {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  activePumps: number;
  totalPumps: number;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
}

export interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useSalesSummary = (period: string = 'today', filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['sales-summary', period, filters],
    queryFn: async (): Promise<SalesSummary> => {
      const { dashboardApi } = await import('@/api/dashboard');
      return dashboardApi.getSalesSummary(period, filters);
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch sales summary.');
    },
  });
};

export const usePaymentMethodBreakdown = (filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['payment-method-breakdown', filters],
    queryFn: async (): Promise<PaymentMethodBreakdown[]> => {
      const { dashboardApi } = await import('@/api/dashboard');
      return dashboardApi.getPaymentMethodBreakdown(filters);
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch payment method breakdown.');
    },
  });
};

export const useFuelTypeBreakdown = (filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['fuel-type-breakdown', filters],
    queryFn: async (): Promise<FuelTypeBreakdown[]> => {
      const { dashboardApi } = await import('@/api/dashboard');
      return dashboardApi.getFuelTypeBreakdown(filters);
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch fuel type breakdown.');
    },
  });
};

export const useDailySalesTrend = (days: number = 7, filters: DashboardFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['daily-sales-trend', days, filters],
    queryFn: async (): Promise<DailySalesTrend[]> => {
      const { dashboardApi } = await import('@/api/dashboard');
      return dashboardApi.getDailySalesTrend(days, filters);
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch daily sales trend.');
    },
  });
};

export const useStationMetrics = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: async (): Promise<StationMetric[]> => {
      console.log('useStationMetrics queryFn triggered'); // Debug log
      try {
        const response = await fetch('/api/dashboard/station-metrics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        console.log('Direct fetch response:', response); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Station metrics raw data:', data); // Debug log
        
        // Handle nested data structure
        if (data?.success && Array.isArray(data.data)) {
          console.log('Returning data.data:', data.data); // Debug log
          return data.data;
        }
        if (Array.isArray(data)) {
          console.log('Returning direct array:', data); // Debug log
          return data;
        }
        
        console.log('No valid data found, returning empty array'); // Debug log
        return [];
      } catch (error) {
        console.error('Station metrics query error:', error); // Debug log
        throw error;
      }
    },
    retry: 3,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Station metrics onError:', error); // Debug log
      handleError(error, 'Failed to fetch station metrics.');
    },
  });
};
