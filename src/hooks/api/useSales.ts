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
      showSuccess('Sales Loaded', `${data?.length || 0} sales transactions loaded`);
    },
    staleTime: 60000,
    onError: (error: any) => {
      handleApiError(error, 'Sales');
    },
  });
};