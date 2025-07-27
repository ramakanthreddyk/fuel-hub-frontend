import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { handleApiResponse } from '@/api/responseHandler';

interface SalesReportParams {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  nozzleId?: string;
  stationId?: string;
}

interface SalesReportData {
  totalAmount: number;
  totalVolume: number;
  totalTransactions: number;
  // TODO: API MISSING - Need these additional fields:
  // dailyBreakdown?: Array<{ date: string; amount: number; volume: number; }>;
  // stationBreakdown?: Array<{ stationId: string; stationName: string; amount: number; }>;
  // fuelTypeBreakdown?: Array<{ fuelType: string; amount: number; volume: number; }>;
  // paymentMethodBreakdown?: { cash: number; card: number; upi: number; credit: number; };
}

export const useSalesReport = (params: SalesReportParams = {}) => {
  return useQuery({
    queryKey: ['sales-report', params],
    queryFn: async (): Promise<SalesReportData> => {
      const searchParams = new URLSearchParams();
      
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.paymentMethod) searchParams.append('paymentMethod', params.paymentMethod);
      if (params.nozzleId) searchParams.append('nozzleId', params.nozzleId);
      if (params.stationId) searchParams.append('stationId', params.stationId);
      
      return handleApiResponse(() => 
        apiClient.get(`/reports/sales?${searchParams.toString()}`)
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};