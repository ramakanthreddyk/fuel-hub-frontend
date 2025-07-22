
/**
 * @file useFuelPrices.ts
 * @description React Query hooks for fuel prices API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';

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
  const { fuelPrices: storedFuelPrices, setFuelPrices, allFuelPrices, setAllFuelPrices } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useQuery<FuelPrice[], Error>({
    queryKey: ['fuel-prices', stationId],
    queryFn: async (): Promise<FuelPrice[]> => {
      // 1. Global cache for all prices (no stationId)
      if (!stationId && allFuelPrices && allFuelPrices.length > 0) {
        console.log('[FUEL-PRICES-HOOK] Using global cached fuel prices');
        return allFuelPrices;
      }
      // 2. Per-station cache
      if (stationId && storedFuelPrices[stationId]) {
        console.log('[FUEL-PRICES-HOOK] Using cached fuel prices for station:', stationId);
        return storedFuelPrices[stationId];
      }
      // 3. Fetch from API
      let params = '';
      if (stationId && typeof stationId === 'string') {
        params = `?stationId=${stationId}`;
      }
      console.log('[FUEL-PRICES-HOOK] Fetching fuel prices with URL:', `/fuel-prices${params}`);
      const response = await apiClient.get(`/fuel-prices${params}`);
      console.log('[FUEL-PRICES-HOOK] Raw response:', response.data);
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
      const formattedPrices = prices.map((price: any) => ({
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
      // Store in cache
      if (!stationId) {
        setAllFuelPrices(formattedPrices);
      } else {
        setFuelPrices(stationId, formattedPrices);
      }
      return formattedPrices;
    },
    enabled: (!stationId && (!allFuelPrices || allFuelPrices.length === 0)) || (stationId && !storedFuelPrices[stationId]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError(error) {
      handleError(error, 'Failed to fetch fuel prices.');
    },
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
        // Ensure stationId is a string, not an object
        if (typeof stationId !== 'string') {
          return {
            stationId: '',
            missingPrices: [{ fuelType: 'all', message: 'Invalid station ID' }],
            hasValidPrices: false
          };
        }
        
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
  const { handleError } = useErrorHandler();

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
      handleError(error, 'Failed to delete fuel price.');
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
