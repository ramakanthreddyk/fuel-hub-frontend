
/**
 * @file api/stations.ts
 * @description Stations API service
 */
import { useApi } from '@/contexts/ApiContext';
import { API_CONFIG } from '@/contexts/ApiContext';

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  managerName?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStationData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  managerName?: string;
  description?: string;
}

export const stationsApi = {
  /**
   * Get all stations
   */
  getStations: async (): Promise<Station[]> => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stations}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': user.tenantId || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Get station by ID
   */
  getStation: async (id: string): Promise<Station> => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stations}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': user.tenantId || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch station');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Create a new station
   */
  createStation: async (stationData: CreateStationData): Promise<Station> => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stations}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': user.tenantId || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create station');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Update a station
   */
  updateStation: async (id: string, stationData: Partial<CreateStationData>): Promise<Station> => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stations}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': user.tenantId || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stationData),
    });

    if (!response.ok) {
      throw new Error('Failed to update station');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Delete a station
   */
  deleteStation: async (id: string): Promise<void> => {
    const token = localStorage.getItem('fuelsync_token');
    const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stations}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': user.tenantId || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete station');
    }
  },
};
