
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/api/sales';
import { usePumps } from '@/hooks/api/usePumps';

// Export the enhanced sale type
export interface EnhancedSale {
  id: string;
  nozzleId: string;
  stationId: string;
  pumpId?: string;
  reading: number;
  volume: number;
  amount: number;
  fuelType: string;
  fuelPrice: number;
  paymentMethod: string;
  recordedAt: string;
  status: string;
  pump?: any;
  station?: any;
  nozzle?: any;
}

export const useEnhancedSales = (filters: any = {}) => {
  const { data: sales = [], isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesApi.getSales(filters),
  });

  // Get unique station IDs from sales to fetch pumps
  const stationIds = [...new Set(sales.map(sale => sale.stationId).filter(Boolean))];
  const firstStationId = stationIds[0];

  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(firstStationId);

  const enhancedSales: EnhancedSale[] = sales.map(sale => ({
    ...sale,
    pump: pumps.find(p => p.id === sale.pumpId),
  }));

  return {
    data: enhancedSales,
    isLoading: salesLoading || pumpsLoading,
    error: salesError,
  };
};
