
import { useMemo } from 'react';
import { useSales } from './useSales';
import { useDataMapping } from '@/contexts/DataMappingContext';
import { SalesFilters } from '@/api/sales';
import { formatSafeNumber, formatSafeDate } from '@/utils/formatters';

export interface EnhancedSale {
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  creditorId?: string;
  status: 'draft' | 'posted';
  recordedAt: string;
  createdAt: string;
  station: {
    name: string;
  };
  nozzle: {
    nozzleNumber: number;
    fuelType: string;
  };
}

export const useEnhancedSales = (filters: SalesFilters = {}) => {
  const { data: rawSales = [], isLoading: salesLoading, error } = useSales(filters);
  const { 
    getStationByNozzleId, 
    getNozzleNumber, 
    getNozzleFuelType,
    isLoading: mappingLoading 
  } = useDataMapping();

  const enhancedSales = useMemo(() => {
    if (mappingLoading || salesLoading) return [];
    
    console.log('[ENHANCED-SALES] Processing raw sales:', rawSales.length);
    
    return rawSales.map((sale: any): EnhancedSale => {
      const nozzleId = sale.nozzle_id || sale.nozzleId || '';
      const volume = typeof sale.volume === 'string' ? parseFloat(sale.volume) : (sale.volume || 0);
      const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) : (sale.amount || 0);
      
      // Calculate fuel price from volume and amount
      const fuelPrice = volume > 0 ? amount / volume : 0;
      
      const enhanced: EnhancedSale = {
        id: sale.id,
        nozzleId: nozzleId,
        stationId: sale.station_id || sale.stationId || '',
        volume: isNaN(volume) ? 0 : volume,
        fuelType: getNozzleFuelType(nozzleId),
        fuelPrice: isNaN(fuelPrice) ? 0 : fuelPrice,
        amount: isNaN(amount) ? 0 : amount,
        paymentMethod: sale.payment_method || sale.paymentMethod || 'cash',
        creditorId: sale.creditor_id || sale.creditorId,
        status: sale.status || 'posted',
        recordedAt: sale.recorded_at || sale.recordedAt || new Date().toISOString(),
        createdAt: sale.created_at || sale.createdAt || new Date().toISOString(),
        station: {
          name: getStationByNozzleId(nozzleId),
        },
        nozzle: {
          nozzleNumber: getNozzleNumber(nozzleId),
          fuelType: getNozzleFuelType(nozzleId),
        },
      };
      
      return enhanced;
    });
  }, [rawSales, mappingLoading, salesLoading, getStationByNozzleId, getNozzleNumber, getNozzleFuelType]);

  console.log('[ENHANCED-SALES] Enhanced sales result:', enhancedSales.length);

  return {
    data: enhancedSales,
    isLoading: salesLoading || mappingLoading,
    error,
  };
};
