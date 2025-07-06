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
  
  if (!hasFuelPrices) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Missing fuel prices</span>
      </div>
    );
  }
  
  // Group prices by fuel type
  const pricesByType: Record<string, any> = {};
  
  fuelPrices.forEach(price => {
    if (!pricesByType[price.fuelType] || 
        new Date(price.validFrom) > new Date(pricesByType[price.fuelType].validFrom)) {
      pricesByType[price.fuelType] = price;
    }
  });
  
  return (
    <div className="space-y-1">
      {Object.entries(pricesByType).map(([type, price]) => (
        <div key={type} className="flex justify-between items-center">
          <span className="text-xs capitalize">{type}:</span>
          <span className="font-medium">₹{formatPrice(price.price)}</span>
        </div>
      ))}
    </div>
  );
}