/**
 * @file hooks/api/useSales.ts
 * @description React Query hooks for sales API
 */
import { useQuery } from '@tanstack/react-query';
import { salesService, SalesFilters } from '@/api/services/salesService';
import { useToastNotifications } from '@/hooks/useToastNotifications';

/**
 * Hook to fetch sales
 */
export const useSales = (filters: SalesFilters = {}) => {
  const { showLoader, hideLoader, handleApiError, showSuccess } = useToastNotifications();
  
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      const data = await salesService.getSales(filters);
      console.log('[SALES-HOOK] Raw data received:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('[SALES-HOOK] Success callback - data length:', data?.length);

      // Only show success message if there's actual data
      if (data && data.length > 0) {
        showSuccess('Sales Loaded', `${data.length} sales transactions loaded`);
      } else {
        console.log('[SALES-HOOK] No sales data available');
        // Don't show success toast for empty data
      }
    },
    staleTime: 60000,
    onError: (error: any) => {
      // Only show error for actual errors, not empty data scenarios
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        handleApiError(error, 'Sales');
      } else {
        console.log('[SALES-HOOK] Non-critical error:', error?.response?.status);
        // Don't show error toast for empty data scenarios
      }
    },
  });
};