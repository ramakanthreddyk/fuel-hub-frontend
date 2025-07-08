/**
 * @file components/stations/FuelPricesInfo.tsx
 * @description Simplified component to display fuel prices for a station
 */
import { useHasFuelPrices } from '@/hooks/api/useFuelPrices';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface FuelPricesInfoProps {
  stationId: string;
}

export function FuelPricesInfo({ stationId }: FuelPricesInfoProps) {
  const { hasFuelPrices, isLoading, fuelPrices } = useHasFuelPrices(stationId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-10">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  if (!hasFuelPrices || !Array.isArray(fuelPrices) || fuelPrices.length === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Missing fuel prices</span>
      </div>
    );
  }
  
  // Group prices by fuel type and get the latest price for each type
  const pricesByType: Record<string, any> = {};
  
  // Extract prices array from the response object
  let pricesArray = [];
  if (Array.isArray(fuelPrices)) {
    pricesArray = fuelPrices;
  } else if (fuelPrices?.data?.prices && Array.isArray(fuelPrices.data.prices)) {
    pricesArray = fuelPrices.data.prices;
  } else if (fuelPrices?.prices && Array.isArray(fuelPrices.prices)) {
    pricesArray = fuelPrices.prices;
  }
  
  pricesArray.forEach(price => {
    if (price && price.fuelType && price.price !== undefined) {
      if (!pricesByType[price.fuelType] || 
          new Date(price.validFrom || 0) > new Date(pricesByType[price.fuelType].validFrom || 0)) {
        pricesByType[price.fuelType] = price;
      }
    }
  });
  
  const priceEntries = Object.entries(pricesByType);
  
  if (priceEntries.length === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">No valid prices found</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {priceEntries.map(([type, price]) => (
        <div key={type} className="flex justify-between items-center">
          <span className="text-xs capitalize">{type}:</span>
          <span className="font-medium">₹{price.price?.toFixed(2) || '0.00'}</span>
        </div>
      ))}
    </div>
  );
}