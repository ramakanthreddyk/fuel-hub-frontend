/**
 * Inventory Types
 * 
 * This file contains types related to fuel inventory to avoid duplicate interface errors
 */

export interface FuelInventory {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  capacity?: number;
  minimumLevel?: number;
  status?: 'normal' | 'low' | 'critical';
  currentVolume: number;
  lastUpdated: string;
  // Additional properties needed by components
  currentStock?: number; // Alias for currentVolume
}