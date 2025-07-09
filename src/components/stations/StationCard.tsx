
/**
 * @file components/stations/StationCard.tsx
 * @description Refactored station card using smaller components
 */
import React from 'react';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { StationHeader } from './StationHeader';
import { StationVisual } from './StationVisual';
import { StationStats } from './StationStats';
import { StationActions } from './StationActions';

interface StationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    status: 'active' | 'maintenance' | 'inactive';
    pumpCount: number;
    rating?: number;
  };
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
}

export function StationCard({ station, onView, onDelete }: StationCardProps) {
  const { data: fuelPrices = [], isLoading: pricesLoading } = useFuelPrices(station.id);

  // Process fuel prices to get the latest price for each fuel type
  const processedPrices = React.useMemo(() => {
    if (!Array.isArray(fuelPrices) || fuelPrices.length === 0) return {};
    
    const pricesByType: Record<string, any> = {};
    
    fuelPrices.forEach(price => {
      if (price && price.fuelType && price.price !== undefined) {
        if (!pricesByType[price.fuelType] || 
            new Date(price.validFrom || 0) > new Date(pricesByType[price.fuelType].validFrom || 0)) {
          pricesByType[price.fuelType] = price;
        }
      }
    });
    
    return pricesByType;
  }, [fuelPrices]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <StationHeader
          name={station.name}
          address={station.address}
          status={station.status}
        />
      </div>

      {/* Station Visual */}
      <div className="px-6 pb-4">
        <StationVisual
          stationName={station.name}
          pumpCount={station.pumpCount}
        />
      </div>

      {/* Stats Sections */}
      <div className="px-6 space-y-4">
        <StationStats
          pumpCount={station.pumpCount}
          fuelPrices={processedPrices}
          pricesLoading={pricesLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-4">
        <StationActions
          onView={() => onView(station.id)}
          onDelete={() => onDelete(station.id)}
        />
      </div>
    </div>
  );
}
