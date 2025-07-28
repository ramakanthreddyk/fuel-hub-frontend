
/**
 * @file nozzlesService.ts
 * @description Service for nozzles API endpoints
 */
import { apiClient, extractApiData as extractData, extractApiArray as extractArray } from '../client';
import API_CONFIG from '../core/config';

export interface Nozzle {
  id: string;
  pumpId: string;
  pump_id?: string; // For backward compatibility
  pumpName?: string;
  pump_name?: string; // For backward compatibility
  nozzleNumber: number;
  nozzle_number?: number; // For backward compatibility
  fuelType: 'petrol' | 'diesel' | 'premium';
  fuel_type?: string; // For backward compatibility
  status: 'active' | 'inactive' | 'maintenance';
  lastReading?: number;
  last_reading?: number; // For backward compatibility
  createdAt: string;
  created_at?: string; // For backward compatibility
  stationId?: string;
  station_id?: string; // For backward compatibility
  stationName?: string;
  station_name?: string; // For backward compatibility
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

export const nozzlesService = {
  getNozzles: async (pumpId?: string): Promise<Nozzle[]> => {
    try {
      console.log('[NOZZLES-API] Fetching nozzles', pumpId ? `for pump ${pumpId}` : 'for all pumps');
      const params = pumpId ? `?pumpId=${pumpId}` : '';
      const response = await apiClient.get(`${API_CONFIG.endpoints.nozzles.base}${params}`);
      const nozzles = extractArray<Nozzle>(response, 'nozzles');
      
      // Transform response to ensure consistent property names
      const normalizedNozzles = nozzles.map(nozzle => {
        // Ensure fuelType is one of the allowed values
        const fuelType = (nozzle.fuelType || nozzle.fuel_type || 'petrol') as 'petrol' | 'diesel' | 'premium';
        // Ensure status is one of the allowed values
        const status = (nozzle.status || 'active') as 'active' | 'inactive' | 'maintenance';
        
        return {
          ...nozzle,
          id: nozzle.id,
          pumpId: nozzle.pumpId || nozzle.pump_id,
          pumpName: nozzle.pumpName || nozzle.pump_name,
          lastReading: nozzle.lastReading || nozzle.last_reading,
          nozzleNumber: nozzle.nozzleNumber || nozzle.nozzle_number,
          fuelType: fuelType,
          status: status,
          createdAt: nozzle.createdAt || nozzle.created_at,
          stationId: nozzle.stationId || nozzle.station_id,
          stationName: nozzle.stationName || nozzle.station_name
        };
      });
      
      console.log(`[NOZZLES-API] Successfully fetched ${normalizedNozzles.length} nozzles`);
      return normalizedNozzles;
    } catch (error) {
      console.error('[NOZZLES-API] Error fetching nozzles:', error);
      throw error;
    }
  },

  getNozzle: async (id: string): Promise<Nozzle> => {
    const response = await apiClient.get(API_CONFIG.endpoints.nozzles.byId(id));
    return extractData<Nozzle>(response);
  },

  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post(API_CONFIG.endpoints.nozzles.base, data);
    return extractData<Nozzle>(response);
  },

  updateNozzle: async (id: string, data: Partial<CreateNozzleRequest>): Promise<Nozzle> => {
    const response = await apiClient.put(API_CONFIG.endpoints.nozzles.byId(id), data);
    return extractData<Nozzle>(response);
  },

  deleteNozzle: async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.endpoints.nozzles.byId(id));
  },
  
  getNozzleSettings: async (id: string): Promise<any> => {
    const response = await apiClient.get(API_CONFIG.endpoints.nozzles.settings(id));
    return extractData<any>(response);
  },
  
  updateNozzleSettings: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(API_CONFIG.endpoints.nozzles.settings(id), data);
    return extractData<any>(response);
  }
};

export default nozzlesService;
