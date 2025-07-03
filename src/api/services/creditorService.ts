/**
 * @file api/services/creditorService.ts
 * @description Service for creditor API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

// Types
export interface Creditor {
  id: string;
  name: string;
  contactNumber?: string;
  email?: string;
  stationId: string;
  status: 'active' | 'inactive';
  creditLimit?: number;
  currentBalance?: number;
}

/**
 * Service for creditor API
 */
export const creditorService = {
  /**
   * Get creditors for a station
   * @param stationId Station ID
   * @returns List of creditors
   */
  getCreditors: async (stationId: string): Promise<Creditor[]> => {
    try {
      console.log('[CREDITOR-API] Fetching creditors for station:', stationId);
      const response = await apiClient.get(`creditors`, { params: { stationId } });
      return extractArray<Creditor>(response);
    } catch (error) {
      console.error('[CREDITOR-API] Error fetching creditors:', error);
      return [];
    }
  },
  
  /**
   * Get a creditor by ID
   * @param id Creditor ID
   * @returns Creditor details
   */
  getCreditor: async (id: string): Promise<Creditor | null> => {
    try {
      console.log('[CREDITOR-API] Fetching creditor details for ID:', id);
      const response = await apiClient.get(`creditors/${id}`);
      return extractData<Creditor>(response);
    } catch (error) {
      console.error(`[CREDITOR-API] Error fetching creditor ${id}:`, error);
      return null;
    }
  }
};

export default creditorService;