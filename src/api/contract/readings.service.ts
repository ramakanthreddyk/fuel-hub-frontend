
/**
 * Readings Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 * All endpoints use the contract client for consistent error handling.
 */

import { contractClient } from '../contract-client';
import type { NozzleReading, CreateReadingRequest } from '../api-contract';

export const readingsService = {
  /**
   * Create new nozzle reading
   */
  async createReading(data: CreateReadingRequest): Promise<NozzleReading> {
    return contractClient.post<NozzleReading>('/nozzle-readings', data);
  },

  /**
   * Get nozzle readings with optional filters
   */
  async getReadings(params?: {
    nozzleId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<NozzleReading[]> {
    const searchParams = new URLSearchParams();
    if (params?.nozzleId) searchParams.set('nozzleId', params.nozzleId);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);

    const endpoint = `/nozzle-readings${searchParams.toString() ? `?${searchParams}` : ''}`;
    return contractClient.getArray<NozzleReading>(endpoint, 'readings');
  },

  /**
   * Get latest reading for a nozzle
   */
  async getLatestReading(nozzleId: string): Promise<NozzleReading | null> {
    try {
      const readings = await this.getReadings({ nozzleId });
      return readings.length > 0 ? readings[0] : null;
    } catch (error) {
      console.warn('Failed to get latest reading:', error);
      return null;
    }
  },

  /**
   * Check if reading can be created for nozzle
   */
  async canCreateReading(nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> {
    try {
      const response = await contractClient.get<{ canCreate: boolean; reason?: string; missingPrice?: boolean }>(`/nozzle-readings/can-create/${nozzleId}`);
      return response;
    } catch (error) {
      console.warn('Failed to check reading creation:', error);
      return { canCreate: false, reason: 'Unable to verify reading requirements' };
    }
  }
};
