/**
 * Nozzles Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 * All endpoints use the contract client for consistent error handling.
 */

import { contractClient } from '../contract-client';
import type { Nozzle, CreateNozzleRequest } from '../api-contract';

export const nozzlesService = {
  /**
   * Get nozzles for a pump
   */
  async getNozzles(pumpId?: string): Promise<Nozzle[]> {
    const endpoint = pumpId ? `/nozzles?pumpId=${pumpId}` : '/nozzles';
    return contractClient.getArray<Nozzle>(endpoint, 'nozzles');
  },

  /**
   * Get single nozzle by ID
   */
  async getNozzle(nozzleId: string): Promise<Nozzle> {
    return contractClient.get<Nozzle>(`/nozzles/${nozzleId}`);
  },

  /**
   * Create new nozzle
   */
  async createNozzle(data: CreateNozzleRequest): Promise<Nozzle> {
    return contractClient.post<Nozzle>('/nozzles', data);
  },

  /**
   * Update nozzle
   */
  async updateNozzle(nozzleId: string, data: Partial<CreateNozzleRequest>): Promise<Nozzle> {
    return contractClient.put<Nozzle>(`/nozzles/${nozzleId}`, data);
  },

  /**
   * Delete nozzle
   */
  async deleteNozzle(nozzleId: string): Promise<void> {
    await contractClient.delete(`/nozzles/${nozzleId}`);
  }
};