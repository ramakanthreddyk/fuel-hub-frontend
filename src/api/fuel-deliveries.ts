
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
    
    console.log('Fuel deliveries API response:', response.data);
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.deliveries)) {
      return response.data.deliveries;
    } else {
      console.warn('Unexpected fuel deliveries response format:', response.data);
      return [];
    }
  },

  // Create new fuel delivery
  createFuelDelivery: async (deliveryData: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    const response = await apiClient.post('/fuel-deliveries', deliveryData);
    return response.data;
  }
};
