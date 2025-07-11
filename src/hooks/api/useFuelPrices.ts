
/**
 * @file useFuelPrices.ts
 * @description React Query hooks for fuel prices API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { useToast } from '@/hooks/use-toast';

export interface FuelPrice {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: string;
  price: number;
  costPrice?: number;
  validFrom: string;
  isActive?: boolean;
  createdAt: string;
}

export interface FuelPriceValidation {
  stationId: string;
  missingPrices: Array<{
    fuelType: string;
    message: string;
  }>;
  hasValidPrices: boolean;
  lastUpdated?: string;
}

export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: async (): Promise<FuelPrice[]> => {
      const params = stationId ? `?stationId=${stationId}` : '';
      const response = await apiClient.get(`/fuel-prices${params}`);
      
      console.log('[FUEL-PRICES-HOOK] Raw response:', response.data);
      
      // Handle the API response structure: {success: true, data: {prices: [...]}}
      let prices: any[] = [];
      
      if (response.data?.success && response.data?.data?.prices) {
        prices = response.data.data.prices;
      } else if (response.data?.data?.prices) {
        prices = response.data.data.prices;
      } else if (response.data?.prices) {
        prices = response.data.prices;
      } else if (Array.isArray(response.data)) {
        prices = response.data;
      } else {
        prices = [];
      }
      
      console.log('[FUEL-PRICES-HOOK] Processed prices:', prices);
      
      // Convert to proper format with type safety
      return prices.map((price: any) => ({
        id: price.id || '',
        stationId: price.stationId || price.station_id || '',
        stationName: price.stationName || price.station_name || '',
        fuelType: price.fuelType || price.fuel_type || '',
        price: parseFloat(price.price) || 0,
        costPrice: price.costPrice ? parseFloat(price.costPrice) : undefined,
        validFrom: price.validFrom || price.valid_from || new Date().toISOString(),
        isActive: price.isActive !== false,
        createdAt: price.createdAt || price.created_at || new Date().toISOString()
      }));
    },
    enabled: true,
  });
};

export const useFuelPriceValidation = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-price-validation', stationId],
    queryFn: async (): Promise<FuelPriceValidation> => {
      if (!stationId) {
        return {
          stationId: '',
          missingPrices: [],
          hasValidPrices: false
        };
      }
      
      try {
        // Get fuel prices for the station and check if they exist
        const response = await apiClient.get(`/fuel-prices?stationId=${stationId}`);
        let prices: any[] = [];
        
        if (response.data?.success && response.data?.data?.prices) {
          prices = response.data.data.prices;
        } else if (response.data?.data?.prices) {
          prices = response.data.data.prices;
        } else if (response.data?.prices) {
          prices = response.data.prices;
        } else if (Array.isArray(response.data)) {
          prices = response.data;
        }
        
        const hasValidPrices = prices.length > 0;
        
        return {
          stationId,
          missingPrices: hasValidPrices ? [] : [{ fuelType: 'all', message: 'No fuel prices set' }],
          hasValidPrices
        };
      } catch (error) {
        return {
          stationId,
          missingPrices: [{ fuelType: 'all', message: 'Unable to check fuel prices' }],
          hasValidPrices: false
        };
      }
    },
    enabled: !!stationId,
  });
};

export const useDeleteFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/fuel-prices/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: 'Success',
        description: 'Fuel price deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete fuel price',
        variant: 'destructive',
      });
    }
  });
};

export const useHasFuelPrices = (stationId: string) => {
  const { data: fuelPrices = [], isLoading } = useFuelPrices(stationId);
  
  return {
    hasFuelPrices: fuelPrices.length > 0,
    fuelPrices,
    isLoading
  };
};
