
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
      // Mock data for demonstration
      return {
        totalRevenue: 250000,
        totalVolume: 3200,
        salesCount: 89,
        growthPercentage: 12
      };
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
      // Mock data for demonstration
      return [
        { paymentMethod: 'cash', amount: 80000, percentage: 32 },
        { paymentMethod: 'card', amount: 75000, percentage: 30 },
        { paymentMethod: 'upi', amount: 65000, percentage: 26 },
        { paymentMethod: 'credit', amount: 30000, percentage: 12 }
      ];
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
      // Mock data for demonstration
      return [
        { fuelType: 'petrol', volume: 1800, amount: 150000 },
        { fuelType: 'diesel', volume: 1200, amount: 85000 },
        { fuelType: 'premium', volume: 200, amount: 25000 }
      ];
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
      // Mock data for demonstration
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          amount: 180000 + Math.random() * 80000,
          volume: 2000 + Math.random() * 1000
        });
      }
      return data;
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
      // Mock data for demonstration
      return [
        {
          id: '1',
          name: 'Main Street Station',
          status: 'active',
          activePumps: 6,
          totalPumps: 8,
          todaySales: 145000,
          monthlySales: 3800000,
          salesGrowth: 15
        },
        {
          id: '2',
          name: 'Highway Junction',
          status: 'active',
          activePumps: 4,
          totalPumps: 6,
          todaySales: 98000,
          monthlySales: 2500000,
          salesGrowth: 8
        },
        {
          id: '3',
          name: 'City Center',
          status: 'maintenance',
          activePumps: 2,
          totalPumps: 4,
          todaySales: 45000,
          monthlySales: 1200000,
          salesGrowth: -5
        }
      ];
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch station metrics.');
    },
  });
};
