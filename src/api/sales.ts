
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Sale, SalesFilters, ApiResponse } from './api-contract';

export const salesApi = {
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await apiClient.get(`/sales?${params.toString()}`);
    const sales = extractApiArray<any>(response, 'sales');
    
    // Transform to ensure proper Sale structure
    return sales.map((sale: any) => ({
      id: sale.id,
      nozzleId: sale.nozzleId || sale.nozzle_id,
      nozzleName: sale.nozzleName || sale.nozzle_name || String(sale.nozzle_number || ''),
      stationId: sale.stationId || sale.station_id,
      stationName: sale.stationName || sale.station_name,
      pumpId: sale.pumpId || sale.pump_id,
      pumpName: sale.pumpName || sale.pump_name,
      volume: sale.volume || 0,
      fuelType: sale.fuelType || sale.fuel_type,
      fuelPrice: sale.fuelPrice || sale.fuel_price || 0,
      amount: sale.amount || 0,
      paymentMethod: sale.paymentMethod || sale.payment_method,
      creditorId: sale.creditorId || sale.creditor_id,
      creditorName: sale.creditorName || sale.creditor_name,
      status: sale.status || 'posted',
      recordedAt: sale.recordedAt || sale.recorded_at,
      createdAt: sale.createdAt || sale.created_at,
      updatedAt: sale.updatedAt || sale.updated_at,
      attendantId: sale.attendantId || sale.attendant_id,
      attendantName: sale.attendantName || sale.attendant_name,
      notes: sale.notes
    }));
  }
};

export type { Sale, SalesFilters };
