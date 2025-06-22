
import { apiClient } from './client';

export interface FuelDelivery {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
  createdAt: string;
}

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy?: string;
}

export const fuelDeliveriesApi = {
  // Get all fuel deliveries
  getFuelDeliveries: async (stationId?: string): Promise<FuelDelivery[]> => {
    const params = stationId ? { stationId } : {};
    const response = await apiClient.get('/fuel-deliveries', { params });
    return response.data;
  },

  // Create new fuel delivery
  createFuelDelivery: async (deliveryData: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    const response = await apiClient.post('/fuel-deliveries', deliveryData);
    return response.data;
  }
};
