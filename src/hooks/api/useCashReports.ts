import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface CashReport {
  id: string;
  tenantId: string;
  stationId: string;
  stationName?: string;
  userId: string;
  userName?: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  creditAmount: number;
  totalAmount: number;
  notes?: string;
  status: 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CashReportSubmission {
  stationId: string;
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  creditAmount: number;
  creditorId?: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  date?: string;
}

export function useCashReports(stationId?: string) {
  return useQuery({
    queryKey: ['cash-reports', stationId],
    queryFn: async () => {
      const params = stationId ? `?stationId=${stationId}` : '';
      const response = await apiClient.get(`/attendant/cash-reports${params}`);
      return response.data.data.reports as CashReport[];
    }
  });
}

export function useCreateCashReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CashReportSubmission) => {
      const response = await apiClient.post('/attendant/cash-report', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-reports'] });
    }
  });
}