
/**
 * Stations Service - Contract Aligned
 * 
 * Implements station endpoints exactly as defined in OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  Station,
  CreateStationRequest 
} from '../api-contract';

export class StationsService {
  /**
   * List stations in tenant
   * GET /stations
   */
  async getStations(includeMetrics?: boolean): Promise<Station[]> {
    const params = includeMetrics ? { includeMetrics: 'true' } : undefined;
    return contractClient.getArray<Station>('/stations', 'stations', params);
  }

  /**
   * Get station by ID
   * GET /stations/{stationId}
   */
  async getStation(stationId: string): Promise<Station> {
    return contractClient.get<Station>(`/stations/${stationId}`);
  }

  /**
   * Create new station
   * POST /stations
   */
  async createStation(data: CreateStationRequest): Promise<Station> {
    return contractClient.post<Station>('/stations', data);
  }

  /**
   * Update station
   * PUT /stations/{stationId}
   */
  async updateStation(stationId: string, data: Partial<CreateStationRequest>): Promise<Station> {
    return contractClient.put<Station>(`/stations/${stationId}`, data);
  }

  /**
   * Delete station
   * DELETE /stations/{stationId}
   */
  async deleteStation(stationId: string): Promise<void> {
    return contractClient.delete(`/stations/${stationId}`);
  }
}

export const stationsService = new StationsService();
