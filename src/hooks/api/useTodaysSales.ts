
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';

// Interface matching the actual backend response structure
interface TodaysSalesData {
  date: string;
  totalEntries: number;
  totalVolume: number;
  totalAmount: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
    credit: number;
  };
  nozzleEntries: Array<{
    nozzle_id: string;
    nozzle_number: number;
    fuel_type: string;
    pump_id: string;
    pump_name: string;
    station_id: string;
    station_name: string;
    entries_count: number;
    total_volume: number;
    total_amount: number;
    last_entry_time: string;
    average_ticket_size: number;
  }>;
  salesByFuel: Array<{
    fuel_type: string;
    total_volume: number;
    total_amount: number;
    entries_count: number;
    average_price: number;
    stations_count: number;
  }>;
  salesByStation: Array<{
    station_id: string;
    station_name: string;
    total_volume: number;
    total_amount: number;
    entries_count: number;
    fuel_types: string[];
    nozzles_active: number;
    last_activity: string | null;
  }>;
  creditSales: Array<any>;
}

export const useTodaysSales = (date?: string) => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['todays-sales', date],
    queryFn: async (): Promise<TodaysSalesData> => {
      const params = new URLSearchParams();
      if (date) {
        params.append('date', date);
      }
      
      return handleApiResponse(() => 
        apiClient.get(`/todays-sales/summary${params.toString() ? '?' + params.toString() : ''}`)
      );
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Today\'s Sales');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading today\'s sales...');
  return query;
};
