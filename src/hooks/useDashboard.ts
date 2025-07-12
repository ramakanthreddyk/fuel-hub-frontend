
/**
 * @file hooks/useDashboard.ts
 * @description Dashboard-specific hooks for fetching summary data
 */
import { useQuery } from '@tanstack/react-query';

// Mock data for now - replace with actual API calls later
const mockSalesSummary = {
  totalRevenue: 150000,
  totalVolume: 12500,
  totalTransactions: 456,
  averagePerTransaction: 329
};

const mockStationMetrics = [
  {
    id: '1',
    name: 'Station A',
    status: 'active',
    todaySales: 15000,
    monthlySales: 450000,
    activePumps: 4,
    totalPumps: 4
  },
  {
    id: '2', 
    name: 'Station B',
    status: 'active',
    todaySales: 12000,
    monthlySales: 360000,
    activePumps: 3,
    totalPumps: 4
  }
];

export const useSalesSummary = (period: string, filters: any) => {
  return useQuery({
    queryKey: ['sales-summary', period, filters],
    queryFn: async () => {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSalesSummary;
    },
    staleTime: 60000,
  });
};

export const useStationMetrics = () => {
  return useQuery({
    queryKey: ['station-metrics'],
    queryFn: async () => {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStationMetrics;
    },
    staleTime: 60000,
  });
};
