/**
 * @file shared/types/fuel.ts
 * @description Fuel-related type definitions
 */

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  PREMIUM = 'premium'
}

export interface FuelTypeOption {
  readonly value: FuelType;
  readonly label: string;
  readonly color: string;
  readonly icon?: string;
}

export const FUEL_TYPE_OPTIONS: readonly FuelTypeOption[] = [
  { value: FuelType.PETROL, label: 'Petrol', color: 'green', icon: '⛽' },
  { value: FuelType.DIESEL, label: 'Diesel', color: 'orange', icon: '🛢️' },
  { value: FuelType.PREMIUM, label: 'Premium', color: 'blue', icon: '⭐' }
] as const;

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: FuelType;
  price: number;
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelInventory {
  id: string;
  stationId: string;
  fuelType: FuelType;
  currentStock: number;
  capacity: number;
  lastUpdated: string;
  reorderLevel: number;
  unit: 'liters' | 'gallons';
}

// Type guards
export const isFuelType = (value: string): value is FuelType => {
  return Object.values(FuelType).includes(value as FuelType);
};

export const getFuelTypeOption = (fuelType: FuelType): FuelTypeOption | undefined => {
  return FUEL_TYPE_OPTIONS.find(option => option.value === fuelType);
};

export const getFuelTypeColor = (fuelType: FuelType): string => {
  return getFuelTypeOption(fuelType)?.color ?? 'gray';
};

export const getFuelTypeLabel = (fuelType: FuelType): string => {
  return getFuelTypeOption(fuelType)?.label ?? fuelType;
};
