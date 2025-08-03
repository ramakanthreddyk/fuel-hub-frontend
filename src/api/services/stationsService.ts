
/**
 * @file api/services/stationsService.ts
 * @description Service for stations API endpoints with integration fixes
 */
import apiClient, { extractData } from '../core/apiClient';
import API_CONFIG from '../core/config';
import {
  DataTransformer,
  ApiResponseHandler,
  ValidationHelper,
  type FrontendStation,
  type BackendStation
} from '../integration-fixes';

// Types - Updated to match backend and include all required fields
export interface Station extends FrontendStation {
  // Additional frontend-specific fields if needed
  nozzleCount?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

/**
 * Service for stations API
 */
export const stationsService = {
  /**
   * Get all stations with proper data transformation
   */
  getStations: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    includeMetrics?: boolean;
  }): Promise<{
    data: Station[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.includeMetrics) queryParams.append('includeMetrics', 'true');

      const url = `/stations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log(`[STATIONS-API] Fetching stations from ${url}`);

      const response = await apiClient.get(url);

      // Handle different response formats from backend
      const result = ApiResponseHandler.handlePaginatedResponse<Station>(
        response.data,
        (item: BackendStation) => DataTransformer.transformStation(item)
      );

      console.log(`[STATIONS-API] Successfully fetched ${result.data.length} stations`);
      return result;
    } catch (error) {
      console.error('[STATIONS-API] Error fetching stations:', error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  },
  
  /**
   * Get a station by ID with proper data transformation
   */
  getStation: async (id: string): Promise<Station> => {
    try {
      console.log(`[STATIONS-API] Fetching station details for ID: ${id}`);
      const response = await apiClient.get(`/stations/${id}`);

      const station = ApiResponseHandler.handleSingleResponse<Station>(
        response.data,
        (item: BackendStation) => DataTransformer.transformStation(item)
      );

      if (!station) {
        throw new Error('Station not found');
      }

      return station;
    } catch (error) {
      console.error(`[STATIONS-API] Error fetching station ${id}:`, error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  },
  
  /**
   * Create a new station with validation and data transformation
   */
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    try {
      // Validate data before sending
      const validationErrors = ValidationHelper.validateStation(data);
      if (validationErrors.length > 0) {
        const errorMessage = `Please fix the following errors:\n• ${validationErrors.join('\n• ')}`;
        throw new Error(errorMessage);
      }

      console.log('[STATIONS-API] Creating station with data:', data);

      // Transform data to backend format
      const backendData = DataTransformer.transformStationForBackend(data);

      const response = await apiClient.post('/stations', backendData);

      const station = ApiResponseHandler.handleSingleResponse<Station>(
        response.data,
        (item: BackendStation) => DataTransformer.transformStation(item)
      );

      if (!station) {
        throw new Error('Failed to create station');
      }

      return station;
    } catch (error) {
      console.error('[STATIONS-API] Error creating station:', error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  },
  
  /**
   * Update a station with validation and data transformation
   */
  updateStation: async (id: string, data: UpdateStationRequest): Promise<Station> => {
    try {
      // Validate data before sending
      const validationErrors = ValidationHelper.validateStation(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      console.log(`[STATIONS-API] Updating station ${id} with data:`, data);

      // Transform data to backend format
      const backendData = DataTransformer.transformStationForBackend(data);

      const response = await apiClient.put(`/stations/${id}`, backendData);

      const station = ApiResponseHandler.handleSingleResponse<Station>(
        response.data,
        (item: BackendStation) => DataTransformer.transformStation(item)
      );

      if (!station) {
        throw new Error('Failed to update station');
      }

      return station;
    } catch (error) {
      console.error(`[STATIONS-API] Error updating station ${id}:`, error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Delete a station with proper error handling
   */
  deleteStation: async (id: string): Promise<void> => {
    try {
      console.log(`[STATIONS-API] Deleting station ${id}`);
      await apiClient.delete(`/stations/${id}`);
      console.log(`[STATIONS-API] Successfully deleted station ${id}`);
    } catch (error) {
      console.error(`[STATIONS-API] Error deleting station ${id}:`, error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get station metrics with proper data transformation
   */
  getStationMetrics: async (id: string): Promise<{
    stationId: string;
    todaySales: number;
    todayTransactions: number;
    activePumps: number;
    totalPumps: number;
    efficiency: number;
  }> => {
    try {
      console.log(`[STATIONS-API] Fetching metrics for station ${id}`);
      const response = await apiClient.get(`/stations/${id}/metrics`);

      const metrics = ApiResponseHandler.handleSingleResponse(response.data);

      if (!metrics) {
        throw new Error('Metrics not found');
      }

      // Transform snake_case to camelCase
      return DataTransformer.snakeToCamel(metrics);
    } catch (error) {
      console.error(`[STATIONS-API] Error fetching station metrics ${id}:`, error);
      const errorInfo = ApiResponseHandler.handleErrorResponse(error);
      throw new Error(errorInfo.message);
    }
  }
};

export default stationsService;
