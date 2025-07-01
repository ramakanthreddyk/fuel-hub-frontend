import { apiClient } from './client';

export interface Nozzle {
  id: string;
  pumpId?: string;
  pump_id?: string;
  nozzleNumber?: number;
  nozzle_number?: number;
  fuelType?: string;
  fuel_type?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: string;
  status?: string;
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: string;
  status?: string;
}

// Helper function to normalize nozzle data
const normalizeNozzle = (nozzle: any): Nozzle => {
  return {
    id: nozzle.id,
    pumpId: nozzle.pumpId || nozzle.pump_id,
    pump_id: nozzle.pump_id || nozzle.pumpId,
    nozzleNumber: nozzle.nozzleNumber || nozzle.nozzle_number,
    nozzle_number: nozzle.nozzle_number || nozzle.nozzleNumber,
    fuelType: nozzle.fuelType || nozzle.fuel_type,
    fuel_type: nozzle.fuel_type || nozzle.fuelType,
    status: nozzle.status || 'inactive',
    createdAt: nozzle.createdAt || nozzle.created_at,
    created_at: nozzle.created_at || nozzle.createdAt
  };
};

export const nozzlesApi = {
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    console.log('Fetching nozzles for pump:', pumpId);
    
    if (!pumpId) {
      console.error('No pumpId provided to getNozzles');
      return [];
    }
    
    try {
      // Try using apiClient first
      try {
        console.log('Attempting to fetch nozzles with apiClient');
        const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
        console.log('apiClient response:', response);
        
        if (response.data) {
          // Handle array response
          if (Array.isArray(response.data)) {
            return response.data.map(normalizeNozzle);
          }
          // Handle object with nozzles array
          if (response.data.nozzles && Array.isArray(response.data.nozzles)) {
            return response.data.nozzles.map(normalizeNozzle);
          }
        }
      } catch (apiError) {
        console.log('apiClient error, falling back to fetch:', apiError);
      }
      
      // Fall back to direct fetch
      console.log('Using direct fetch for nozzles');
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      console.log('Auth headers:', { token: !!token, tenantId });
      
      const response = await fetch(`/api/v1/nozzles?pumpId=${pumpId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Raw nozzles response:', result);
      
      // Try to extract nozzles from different possible response formats
      let nozzlesArray = [];
      
      // Format 1: { success: true, data: { nozzles: [...] } }
      if (result.success && result.data && result.data.nozzles) {
        nozzlesArray = result.data.nozzles;
        console.log('Found nozzles in result.data.nozzles:', nozzlesArray.length);
      }
      // Format 2: { nozzles: [...] }
      else if (result.nozzles) {
        nozzlesArray = result.nozzles;
        console.log('Found nozzles in result.nozzles:', nozzlesArray.length);
      }
      // Format 3: [...] (array directly)
      else if (Array.isArray(result)) {
        nozzlesArray = result;
        console.log('Result is directly an array:', nozzlesArray.length);
      }
      
      // Normalize all nozzles
      const normalizedNozzles = nozzlesArray.map(normalizeNozzle);
      console.log('Returning normalized nozzles:', normalizedNozzles.length);
      return normalizedNozzles;
    } catch (error) {
      console.error('Error in getNozzles:', error);
      return [];
    }
  },

  getNozzle: async (id: string): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.get(`/nozzles/${id}`);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error('Error in getNozzle:', error);
      return null;
    }
  },

  createNozzle: async (nozzleData: CreateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.post('/nozzles', nozzleData);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error('Error in createNozzle:', error);
      throw error;
    }
  },

  updateNozzle: async (id: string, nozzleData: UpdateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.put(`/nozzles/${id}`, nozzleData);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error('Error in updateNozzle:', error);
      throw error;
    }
  },

  deleteNozzle: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/nozzles/${id}`);
    } catch (error) {
      console.error('Error in deleteNozzle:', error);
      throw error;
    }
  }
};