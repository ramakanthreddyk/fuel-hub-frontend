/**
 * @file api/services/nozzlesService.ts
 * @description Service for nozzles API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface Nozzle {
  id: string;
  pumpId: string;
  stationId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface CanCreateReadingResponse {
  canCreate: boolean;
  reason?: string;
  missingPrice?: boolean;
  fuelType?: string;
}

/**
 * Service for nozzles API
 */
export const nozzlesService = {
  /**
   * Get all nozzles
   * @param pumpId Optional pump ID to filter by
   * @returns List of nozzles
   */
  getNozzles: async (pumpId?: string): Promise<Nozzle[]> => {
    try {
      console.log(`[NOZZLES-API] Fetching nozzles for pump: ${pumpId}`);
      
      // Use query parameter approach as per API spec
      const params = pumpId ? { pumpId } : {};
      const response = await apiClient.get(API_CONFIG.endpoints.nozzles.base, { params });
      
      // Extract nozzles from response
      let nozzlesArray: Nozzle[] = [];
      
      if (response.data?.data?.nozzles) {
        nozzlesArray = response.data.data.nozzles;
      } else if (response.data?.nozzles) {
        nozzlesArray = response.data.nozzles;
      } else if (Array.isArray(response.data)) {
        nozzlesArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        nozzlesArray = response.data.data;
      } else {
        nozzlesArray = extractArray<Nozzle>(response, 'nozzles');
      }
      
      console.log(`[NOZZLES-API] Successfully fetched ${nozzlesArray.length} nozzles`);
      
      // Ensure all nozzles have pumpId
      if (pumpId) {
        nozzlesArray = nozzlesArray.map(nozzle => ({
          ...nozzle,
          pumpId: nozzle.pumpId || pumpId
        }));
      }
      
      return nozzlesArray;
    } catch (error) {
      console.error('[NOZZLES-API] Error fetching nozzles:', error);
      throw error;
    }
  },
  
  /**
   * Get a nozzle by ID
   * @param id Nozzle ID
   * @returns Nozzle details
   */
  getNozzle: async (id: string): Promise<Nozzle> => {
    try {
      console.log(`[NOZZLES-API] Fetching nozzle details for ID: ${id}`);
      const response = await apiClient.get(`${API_CONFIG.endpoints.nozzles.base}/${id}`);
      return extractData<Nozzle>(response);
    } catch (error) {
      console.error(`[NOZZLES-API] Error fetching nozzle ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new nozzle
   * @param data Nozzle data
   * @returns Created nozzle
   */
  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle> => {
    try {
      console.log('[NOZZLES-API] Creating nozzle with data:', data);
      const response = await apiClient.post(API_CONFIG.endpoints.nozzles.base, data);
      return extractData<Nozzle>(response);
    } catch (error) {
      console.error('[NOZZLES-API] Error creating nozzle:', error);
      throw error;
    }
  },
  
  /**
   * Update a nozzle
   * @param id Nozzle ID
   * @param data Nozzle data to update
   * @returns Updated nozzle
   */
  updateNozzle: async (id: string, data: UpdateNozzleRequest): Promise<Nozzle> => {
    try {
      console.log(`[NOZZLES-API] Updating nozzle ${id} with data:`, data);
      const response = await apiClient.put(`${API_CONFIG.endpoints.nozzles.base}/${id}`, data);
      return extractData<Nozzle>(response);
    } catch (error) {
      console.error(`[NOZZLES-API] Error updating nozzle ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a nozzle
   * @param id Nozzle ID
   */
  deleteNozzle: async (id: string): Promise<void> => {
    try {
      console.log(`[NOZZLES-API] Deleting nozzle ${id}`);
      await apiClient.delete(`${API_CONFIG.endpoints.nozzles.base}/${id}`);
      console.log(`[NOZZLES-API] Successfully deleted nozzle ${id}`);
    } catch (error) {
      console.error(`[NOZZLES-API] Error deleting nozzle ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Check if a reading can be created for a nozzle
   * @param nozzleId Nozzle ID
   * @returns Validation result
   */
  canCreateReading: async (nozzleId: string): Promise<CanCreateReadingResponse> => {
    try {
      if (!nozzleId) {
        return { canCreate: false, reason: 'No nozzle selected' };
      }
      
      console.log(`[NOZZLES-API] Checking if reading can be created for nozzle ${nozzleId}`);
      const response = await apiClient.get(API_CONFIG.endpoints.nozzles.canCreate(nozzleId));
      return extractData<CanCreateReadingResponse>(response);
    } catch (error) {
      console.error(`[NOZZLES-API] Error checking if reading can be created for nozzle ${nozzleId}:`, error);
      // Default to allowing creation if API fails
      return { canCreate: true };
    }
  }
};

export default nozzlesService;