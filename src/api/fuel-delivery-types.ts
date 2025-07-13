/**
 * Fuel Delivery Types
 * 
 * This file contains types related to fuel deliveries to avoid duplicate interface errors
 */

export interface CreateFuelDeliveryRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  volume: number;
  deliveryDate: string;
  supplier?: string;
  // Additional properties needed by components
  quantity?: number; // Alias for volume
  supplierName?: string; // Alias for supplier
  invoiceNumber?: string;
  pricePerLitre?: number;
  deliveredBy?: string;
}