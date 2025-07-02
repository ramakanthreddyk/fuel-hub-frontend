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

// API base URL
const API_URL = 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

export const nozzlesApi = {
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    console.log('Fetching nozzles for pump:', pumpId);
    
    if (!pumpId) {
      console.error('No pumpId provided to getNozzles');
      return [];
    }
    
    try {
      // Get auth info
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      console.log(`Fetching nozzles from ${API_URL}/api/v1/nozzles?pumpId=${pumpId}`);
      
      // Make direct API call
      const response = await fetch(`${API_URL}/api/v1/nozzles?pumpId=${pumpId}`, {
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
      
      // Extract nozzles from response
      let nozzlesArray = [];
      
      if (result.success && result.data && result.data.nozzles) {
        nozzlesArray = result.data.nozzles;
      } else if (result.nozzles) {
        nozzlesArray = result.nozzles;
      } else if (Array.isArray(result)) {
        nozzlesArray = result;
      }
      
      // Normalize all nozzles
      return nozzlesArray.map(normalizeNozzle);
    } catch (error) {
      console.error('Error in getNozzles:', error);
      return [];
    }
  },

  getNozzle: async (id: string): Promise<Nozzle | null> => {
    try {
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      const response = await fetch(`${API_URL}/api/v1/nozzles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return normalizeNozzle(data);
    } catch (error) {
      console.error('Error in getNozzle:', error);
      return null;
    }
  },

  createNozzle: async (nozzleData: CreateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      const response = await fetch(`${API_URL}/api/v1/nozzles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(nozzleData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return normalizeNozzle(data);
    } catch (error) {
      console.error('Error in createNozzle:', error);
      throw error;
    }
  },

  updateNozzle: async (id: string, nozzleData: UpdateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      const response = await fetch(`${API_URL}/api/v1/nozzles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(nozzleData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return normalizeNozzle(data);
    } catch (error) {
      console.error('Error in updateNozzle:', error);
      throw error;
    }
  },

  deleteNozzle: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      const response = await fetch(`${API_URL}/api/v1/nozzles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in deleteNozzle:', error);
      throw error;
    }
  }
};
