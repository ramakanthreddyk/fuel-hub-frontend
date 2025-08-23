
/**
 * Readings Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 * All endpoints use the contract client for consistent error handling.
 */

import { contractClient } from '../contract-client';
import type { NozzleReading, CreateReadingRequest } from '../api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

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
    limit?: number;
  }): Promise<NozzleReading[]> {
    const searchParams = new URLSearchParams();
    if (params?.nozzleId) searchParams.set('nozzleId', sanitizeUrlParam(params.nozzleId));
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const endpoint = `/nozzle-readings${searchParams.toString() ? `?${searchParams}` : ''}`;
    return contractClient.getArray<NozzleReading>(endpoint, 'readings');
  },

  /**
   * Get single reading by ID
   */
  async getReading(id: string): Promise<NozzleReading> {
    return contractClient.get<NozzleReading>(`/nozzle-readings/${sanitizeUrlParam(id)}`);
  },

  /**
   * Get latest reading for a nozzle
   */
  async getLatestReading(nozzleId: string): Promise<NozzleReading | null> {
    try {
      const readings = await this.getReadings({ nozzleId, limit: 1 });
      return readings.length > 0 ? readings[0] : null;
    } catch (error) {
      secureLog.warn('Failed to get latest reading:', error);
      return null;
    }
  },

  /**
   * Check if reading can be created for nozzle
   */
  async canCreateReading(nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> {
    try {
      const response = await contractClient.get<{ canCreate: boolean; reason?: string; missingPrice?: boolean }>(`/nozzle-readings/can-create/${sanitizeUrlParam(nozzleId)}`);
      return response;
    } catch (error) {
      secureLog.warn('Failed to check reading creation:', error);
      return { canCreate: false, reason: 'Unable to verify reading requirements' };
    }
  }
};
