/**
 * Pumps Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 * All endpoints use the contract client for consistent error handling.
 */

import { contractClient } from '../contract-client';
import type { Pump, CreatePumpRequest } from '../api-contract';
import { sanitizeUrlParam } from '@/utils/security';

export const pumpsService = {
  /**
   * Get pumps for a station
   * @param stationId - Station ID, or 'all' for all pumps
   */
  async getPumps(stationId?: string): Promise<Pump[]> {
    const endpoint = stationId && stationId !== 'all' 
      ? `/pumps?stationId=${sanitizeUrlParam(stationId)}` 
      : '/pumps';
    
    return contractClient.getArray<Pump>(endpoint, 'pumps');
  },

  /**
   * Get single pump by ID
   */
  async getPump(pumpId: string): Promise<Pump> {
    return contractClient.get<Pump>(`/pumps/${sanitizeUrlParam(pumpId)}`);
  },

  /**
   * Create new pump
   */
  async createPump(data: CreatePumpRequest): Promise<Pump> {
    return contractClient.post<Pump>('/pumps', data);
  },

  /**
   * Update pump
   */
  async updatePump(pumpId: string, data: Partial<CreatePumpRequest>): Promise<Pump> {
    return contractClient.put<Pump>(`/pumps/${sanitizeUrlParam(pumpId)}`, data);
  },

  /**
   * Delete pump
   */
  async deletePump(pumpId: string): Promise<void> {
    await contractClient.delete(`/pumps/${sanitizeUrlParam(pumpId)}`);
  }
};