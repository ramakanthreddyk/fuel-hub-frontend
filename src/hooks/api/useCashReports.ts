/**
 * @file useCashReports.ts
 * @description React Query hooks for cash reports with store sync
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useStoreSync } from '@/hooks/useStoreSync';
import { useNavigate } from 'react-router-dom';

export interface CashReport {
  id: string;
  tenantId: string;
  stationId: string;
  userId: string;
  date: string;
  cashCollected: number;
  cardCollected: number;
  upiCollected: number;
  totalCollected: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  date: string;
  cashCollected: number;
  cardCollected?: number;
  upiCollected?: number;
}

export interface UpdateCashReportRequest {
  cashCollected?: number;
  cardCollected?: number;
  upiCollected?: number;
}

/**
 * Hook to fetch cash reports
 */
export const useCashReports = (stationId?: string, date?: string) => {
  const { handleApiError, showLoading } = useToastNotifications();
  
  return useQuery({
    queryKey: ['cash-reports', stationId, date],
    queryFn: async () => {
      const loadingToast = showLoading('Loading cash reports...');
      try {
        const params = new URLSearchParams();
        if (stationId) params.append('stationId', stationId);
        if (date) params.append('date', date);
        
        const response = await apiClient.get(`/cash-reports?${params}`);
        return response.data?.data || response.data || [];
      } catch (error) {
        handleApiError(error, 'Load Cash Reports');
        throw error;
      } finally {
        if (loadingToast) {
          // Dismiss loading toast
        }
      }
    },
    enabled: !!stationId,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch a single cash report
 */
export const useCashReport = (id: string) => {
  const { handleApiError } = useToastNotifications();
  
  return useQuery({
    queryKey: ['cash-report', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/cash-reports/${id}`);
        return response.data?.data || response.data;
      } catch (error) {
        handleApiError(error, 'Load Cash Report');
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

/**
 * Hook to create a cash report
 */
export const useCreateCashReport = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  navigateAfterSuccess?: boolean;
  navigateTo?: string;
}) => {
  const navigate = useNavigate();
  const { handleApiError } = useToastNotifications();
  const { syncAfterCashReport } = useStoreSync();
  
  return useMutation({
    mutationFn: async (data: CreateCashReportRequest) => {
      const response = await apiClient.post('/attendant/cash-report', data);
      return response.data?.data || response.data;
    },
    onSuccess: async (newReport) => {
      console.log('[CREATE-CASH-REPORT] Success:', newReport);
      
      // Sync stores and invalidate queries
      await syncAfterCashReport('create', newReport);
      
      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(newReport);
      }
      
      // Navigate after success if requested
      if (options?.navigateAfterSuccess !== false) {
        const destination = options?.navigateTo || '/dashboard/reconciliation';
        setTimeout(() => {
          navigate(destination);
        }, 1500);
      }
    },
    onError: (error: any) => {
      console.error('[CREATE-CASH-REPORT] Error:', error);
      handleApiError(error, 'Submit Cash Report');
      
      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Hook to update a cash report
 */
export const useUpdateCashReport = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { handleApiError } = useToastNotifications();
  const { syncAfterCashReport } = useStoreSync();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCashReportRequest }) => {
      const response = await apiClient.put(`/cash-reports/${id}`, data);
      return response.data?.data || response.data;
    },
    onSuccess: async (updatedReport, { id }) => {
      console.log('[UPDATE-CASH-REPORT] Success:', updatedReport);
      
      // Sync stores and invalidate queries
      await syncAfterCashReport('update', updatedReport);
      
      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(updatedReport);
      }
    },
    onError: (error: any) => {
      console.error('[UPDATE-CASH-REPORT] Error:', error);
      handleApiError(error, 'Update Cash Report');
      
      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Hook to delete a cash report
 */
export const useDeleteCashReport = () => {
  const { handleApiError, showSuccess } = useToastNotifications();
  const { syncAfterCashReport } = useStoreSync();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/cash-reports/${id}`);
      return response.data;
    },
    onSuccess: async (data, id) => {
      console.log('[DELETE-CASH-REPORT] Success:', id);
      
      // Sync stores and invalidate queries
      await syncAfterCashReport('update', { id }); // Use update to refresh data
      
      showSuccess('Cash Report Deleted', 'Cash report deleted successfully');
    },
    onError: (error: any) => {
      console.error('[DELETE-CASH-REPORT] Error:', error);
      handleApiError(error, 'Delete Cash Report');
    },
  });
};

/**
 * Hook to get today's cash report for a station
 */
export const useTodaysCashReport = (stationId: string) => {
  const today = new Date().toISOString().split('T')[0];
  return useCashReports(stationId, today);
};
