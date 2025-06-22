
import { apiClient } from './client';

export interface FuelDelivery {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
}

export const fuelDeliveriesApi = {
  // Get all fuel deliveries for a station
  getFuelDeliveries: async (stationId?: string): Promise<FuelDelivery[]> => {
    const params = stationId ? { stationId } : {};
    const response = await apiClient.get('/fuel-deliveries', { params });
    return response.data;
  },

  // Create new fuel delivery
  createFuelDelivery: async (data: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    const response = await apiClient.post('/fuel-deliveries', data);
    return response.data;
  }
};
