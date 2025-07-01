
/**
 * Setup Service - Contract Aligned
 * 
 * Implements setup endpoints exactly as defined in OpenAPI spec
 */

import { contractClient } from '../contract-client';

export interface SetupStatusResponse {
  hasStation: boolean;
  hasPump: boolean;
  hasNozzle: boolean;
  hasFuelPrice: boolean;
  completed: boolean;
}

export class SetupService {
  /**
   * Get setup status for tenant
   * GET /setup-status
   */
  async getSetupStatus(): Promise<SetupStatusResponse> {
    return contractClient.get<SetupStatusResponse>('/setup-status');
  }
}

export const setupService = new SetupService();
