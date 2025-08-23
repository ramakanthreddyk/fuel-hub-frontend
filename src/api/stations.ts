
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Station, ApiResponse } from './api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export interface CreateStationData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export const stationsApi = {
  // Get all stations
  getStations: async (includeMetrics = false): Promise<Station[]> => {
    try {
      const params = includeMetrics ? { includeMetrics: 'true' } : {};
      const response = await apiClient.get('/stations', { params });
      return extractApiArray<Station>(response, 'stations');
    } catch (error) {
      secureLog.error('Error fetching stations:', error);
      return [];
    }
  },

  // Get station by ID
  getStation: async (id: string): Promise<Station> => {
    try {
      const response = await apiClient.get(`/stations/${sanitizeUrlParam(id)}`);
      return extractApiData<Station>(response);
    } catch (error) {
      secureLog.error('Error fetching station:', error);
      throw error;
    }
  },

  // Create station
  createStation: async (data: CreateStationData): Promise<Station> => {
    try {
      const response = await apiClient.post('/stations', data);
      return extractApiData<Station>(response);
    } catch (error) {
      secureLog.error('Error creating station:', error);
      throw error;
    }
  },

  // Update station
  updateStation: async (id: string, data: UpdateStationData): Promise<Station> => {
    try {
      const response = await apiClient.put(`/stations/${sanitizeUrlParam(id)}`, data);
      return extractApiData<Station>(response);
    } catch (error) {
      secureLog.error('Error updating station:', error);
      throw error;
    }
  },

  // Delete station
  deleteStation: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/stations/${sanitizeUrlParam(id)}`);
    } catch (error) {
      secureLog.error('Error deleting station:', error);
      throw error;
    }
  }
};
