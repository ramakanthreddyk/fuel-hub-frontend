import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { handleApiResponse } from '@/api/responseHandler';
import { SalesReportParams, SalesReport } from '@/api/api-contract';
import { useToastNotifications } from '@/hooks/useToastNotifications';

export const useSalesReport = (params: SalesReportParams = {}) => {
  const { showLoader, hideLoader, showSuccess, handleApiError } = useToastNotifications();
  
  return useQuery({
    queryKey: ['sales-report', params],
    queryFn: async (): Promise<SalesReport> => {
      showLoader('Loading sales report...');
      
      const searchParams = new URLSearchParams();
      
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.paymentMethod) searchParams.append('paymentMethod', params.paymentMethod);
      if (params.nozzleId) searchParams.append('nozzleId', params.nozzleId);
      if (params.stationId) searchParams.append('stationId', params.stationId);
      
      const data = await handleApiResponse(() => 
        apiClient.get(`/reports/sales?${searchParams.toString()}`)
      );
      
      hideLoader();
      showSuccess('Sales Report Loaded', 'Detailed sales transactions loaded successfully');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      handleApiError(error, 'Sales Report');
    }
  });
};