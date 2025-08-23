// ...existing code...
import apiClient from '../core/apiClient';
import { secureLog } from '@/utils/security';

export const nozzlesService = {
	// Example method
	getNozzles: async () => {
		try {
			const response = await apiClient.get('/nozzles');
			// Assuming the response contains an array of nozzles under 'nozzles' key
			return response.data?.nozzles || [];
		} catch (error) {
			secureLog.error('[NOZZLES-API] Error fetching nozzles:', error);
			return [];
		}
	}
};

/**
 * @file nozzlesService.ts
 * @description Service for nozzles API endpoints
 */













