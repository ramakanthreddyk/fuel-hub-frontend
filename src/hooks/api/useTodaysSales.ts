
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { handleApiResponse } from '@/api/responseHandler';
import { TodaysSalesSummary } from '@/api/api-contract';
import { useDashboardStore } from '@/store/dashboardStore';

export const useTodaysSales = (date?: string) => {
  const { showSuccess, handleApiError, showLoader, hideLoader } = useToastNotifications();
  const { setTodaysSales, getTodaysSales, setLoading, setError, clearError } = useDashboardStore();
  
  const queryDate = date || new Date().toISOString().split('T')[0];
  const cacheKey = `todays-sales-${queryDate}`;
  
  const query = useQuery({
    queryKey: ['todays-sales', queryDate],
    queryFn: async (): Promise<TodaysSalesSummary> => {
      try {
        setLoading(cacheKey, true);
        clearError(cacheKey);
        showLoader(`Loading sales data${date ? ` for ${new Date(date).toLocaleDateString()}` : ''}...`);
        
        const params = new URLSearchParams();
        if (date) {
          params.append('date', date);
        }
        
        const data = await handleApiResponse(() => 
          apiClient.get(`/todays-sales/summary${params.toString() ? '?' + params.toString() : ''}`)
        );
        
        // Store in Zustand
        setTodaysSales(queryDate, data);
        
        hideLoader();
        showSuccess(
          'Sales Data Loaded', 
          `Successfully loaded sales data${date ? ` for ${new Date(date).toLocaleDateString()}` : ''}`
        );
        
        return data;
      } catch (error: any) {
        hideLoader();
        setError(cacheKey, error.message || 'Failed to load sales data');
        handleApiError(error, `Sales Data${date ? ` (${new Date(date).toLocaleDateString()})` : ''}`);
        throw error;
      } finally {
        setLoading(cacheKey, false);
      }
    },
    staleTime: 300000, // 5 minutes
    // Check cache first
    initialData: () => getTodaysSales(queryDate) || undefined,
  });
  
  return query;
};
