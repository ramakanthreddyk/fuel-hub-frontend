import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { handleApiResponse } from '@/api/responseHandler';
import { SalesReportParams, SalesReport } from '@/api/api-contract';

export const useSalesReport = (params: SalesReportParams = {}) => {
  return useQuery({
    queryKey: ['sales-report', params],
    queryFn: async (): Promise<SalesReport> => {
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