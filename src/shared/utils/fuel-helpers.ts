/**
 * @file shared/utils/fuel-helpers.ts
 * @description Centralized fuel-related utility functions
 */

import { FuelType, FUEL_TYPE_OPTIONS } from '@/shared/types/fuel';

export const getFuelTypeColor = (fuelType: FuelType): string => {
  const option = FUEL_TYPE_OPTIONS.find(opt => opt.value === fuelType);
  return option?.color || 'gray';
};

export const getFuelTypeLabel = (fuelType: FuelType): string => {
  const option = FUEL_TYPE_OPTIONS.find(opt => opt.value === fuelType);
  return option?.label || fuelType;
};

export const getFuelTypeIcon = (fuelType: FuelType): string => {
  const option = FUEL_TYPE_OPTIONS.find(opt => opt.value === fuelType);
  return option?.icon || '⛽';
};

export const isFuelType = (value: string): value is FuelType => {
  return Object.values(FuelType).includes(value as FuelType);
};

export const validateFuelType = (value: string): FuelType | null => {
  return isFuelType(value) ? value : null;
};

export const getFuelTypeTailwindColor = (fuelType: FuelType): string => {
  switch (fuelType) {
    case FuelType.PETROL:
      return 'bg-green-100 text-green-800 border-green-200';
    case FuelType.DIESEL:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case FuelType.PREMIUM:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatFuelVolume = (volume: number, unit: 'liters' | 'gallons' = 'liters'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${formatter.format(volume)} ${unit}`;
};

// Alias for compatibility
export const formatVolume = formatFuelVolume;

// Format price with currency
export function formatPrice(price: number, currency: string = '₹'): string {
  if (isNaN(price)) return `${currency}0.00`;
  
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${currency}${formatter.format(price)}`;
}

export const calculateFuelRevenue = (volume: number, pricePerUnit: number): number => {
  return volume * pricePerUnit;
};

// Alias for compatibility
export const calculateTotalPrice = calculateFuelRevenue;

// Convert volume between units
export function convertVolume(
  volume: number, 
  fromUnit: 'liters' | 'gallons', 
  toUnit: 'liters' | 'gallons'
): number {
  if (isNaN(volume)) return 0;
  if (fromUnit === toUnit) return volume;
  
  // Conversion factor: 1 gallon = 3.78541 liters
  if (fromUnit === 'gallons' && toUnit === 'liters') {
    return volume * 3.78541;
  } else if (fromUnit === 'liters' && toUnit === 'gallons') {
    return volume / 3.78541;
  }
  
  return volume;
}

// Validate fuel data (alias for compatibility)
export const validateFuelData = validateFuelType;
