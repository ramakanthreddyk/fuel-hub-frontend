
import { useQuery } from '@tanstack/react-query';
import { salesApi, SalesFilters } from '@/api/sales';
import { stationsApi } from '@/api/stations';
import { nozzlesApi } from '@/api/nozzles';
import type { Sale } from '@/api/api-contract';

export interface EnhancedSale extends Sale {
  station?: {
    name: string;
  };
  nozzle?: {
    nozzleNumber: number;
  };
}

export const useEnhancedSales = (filters: SalesFilters = {}) => {
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
    staleTime: 300000, // 5 minutes
  });

  return useQuery({
    queryKey: ['enhanced-sales', filters],
    queryFn: async (): Promise<EnhancedSale[]> => {
      console.log('[USE-ENHANCED-SALES] Fetching sales with filters:', filters);
      
      const sales = await salesApi.getSales(filters);
      console.log('[USE-ENHANCED-SALES] Raw sales count:', sales.length);
      
      // Enhance sales with station and nozzle data
      const enhancedSales: EnhancedSale[] = await Promise.all(
        sales.map(async (sale) => {
          const enhancedSale: EnhancedSale = { ...sale };
          
          // Find station by ID
          if (sale.stationId) {
            const station = stations.find(s => s.id === sale.stationId);
            if (station) {
              enhancedSale.station = { name: station.name };
            }
          }
          
          // Try to get nozzle data if we have nozzleId
          if (sale.nozzleId) {
            try {
              const nozzle = await nozzlesApi.getNozzle(sale.nozzleId);
              if (nozzle) {
                enhancedSale.nozzle = { nozzleNumber: nozzle.nozzleNumber };
                // Update fuel type from nozzle if not set
                if (!enhancedSale.fuelType || enhancedSale.fuelType === 'petrol') {
                  enhancedSale.fuelType = nozzle.fuelType;
                }
              }
            } catch (error) {
              console.warn('[USE-ENHANCED-SALES] Failed to fetch nozzle data:', sale.nozzleId);
            }
          }
          
          return enhancedSale;
        })
      );
      
      console.log('[USE-ENHANCED-SALES] Enhanced sales count:', enhancedSales.length);
      return enhancedSales;
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};
