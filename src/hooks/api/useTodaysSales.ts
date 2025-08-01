
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { handleApiResponse } from '@/api/responseHandler';
import { TodaysSalesSummary } from '@/api/api-contract';
import { useDashboardStore } from '@/store/dashboardStore';

export const useTodaysSales = (date?: string, stationId?: string) => {
  const { showSuccess, handleApiError, showLoader, hideLoader } = useToastNotifications();
  const { setTodaysSales, getTodaysSales, setLoading, setError, clearError } = useDashboardStore();
  
  const queryDate = date || new Date().toISOString().split('T')[0];
  const cacheKey = `todays-sales-${queryDate}`;
  
  const query = useQuery({
    queryKey: ['todays-sales', queryDate, stationId],
    queryFn: async (): Promise<TodaysSalesSummary> => {
      try {
        setLoading(cacheKey, true);
        clearError(cacheKey);
        showLoader(`Loading sales data${date ? ` for ${new Date(date).toLocaleDateString()}` : ''}...`);
        
        const params = new URLSearchParams();
        if (date) {
          params.append('date', date);
        }
        if (stationId) {
          params.append('stationId', stationId);
        }
        
        const data = await handleApiResponse(() => 
          apiClient.get(`/todays-sales/summary${params.toString() ? '?' + params.toString() : ''}`)
        );
        
        // Store in Zustand
        setTodaysSales(queryDate, data);
        
        hideLoader();

        // Show appropriate message based on data availability
        if (data.totalEntries === 0) {
          console.log('[TODAYS-SALES] No sales data available');
          // Don't show success toast for empty data, just log it
        } else {
          showSuccess(
            'Sales Data Loaded',
            `Found ${data.totalEntries} sales entries${date ? ` for ${new Date(date).toLocaleDateString()}` : ''}`
          );
        }

        return data;
      } catch (error: any) {
        hideLoader();

        // Only treat auth errors as real errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setError(cacheKey, 'Authentication required');
          handleApiError(error, `Sales Data${date ? ` (${new Date(date).toLocaleDateString()})` : ''}`);
          throw error;
        }

        // For other errors, log but don't show error toast
        console.log('[TODAYS-SALES] Non-critical error:', error?.response?.status, error?.message);
        setError(cacheKey, 'No sales data available');

        // Return empty data instead of throwing
        return {
          date: date || new Date().toISOString().split('T')[0],
          totalEntries: 0,
          totalVolume: 0,
          totalAmount: 0,
          paymentBreakdown: { cash: 0, card: 0, upi: 0, credit: 0 },
          nozzleEntries: [],
          salesByFuel: [],
          salesByStation: [],
          creditSales: []
        };
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
