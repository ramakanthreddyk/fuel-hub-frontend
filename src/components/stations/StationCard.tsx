
/**
 * @file components/stations/StationCard.tsx
 * @description Enhanced station card with improved animations and visual effects
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
    <div className="group relative bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl ${
        station.status === 'active' ? 'shadow-[inset_0_0_50px_rgba(34,197,94,0.3)]' :
        station.status === 'maintenance' ? 'shadow-[inset_0_0_50px_rgba(251,191,36,0.3)]' :
        'shadow-[inset_0_0_50px_rgba(239,68,68,0.3)]'
      }`}></div>

      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <StationHeader
          name={station.name}
          address={station.address}
          status={station.status}
        />
      </div>

      {/* Enhanced Station Visual */}
      <div className="relative z-10 px-6 pb-4">
        <StationVisual
          stationName={station.name}
          pumpCount={station.pumpCount}
        />
      </div>

      {/* Stats Sections with Animation */}
      <div className="relative z-10 px-6 space-y-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">
        <StationStats
          pumpCount={station.pumpCount}
          fuelPrices={processedPrices}
          pricesLoading={pricesLoading}
        />
      </div>

      {/* Action Buttons with Enhanced Styling */}
      <div className="relative z-10 p-6 pt-4">
        <StationActions
          onView={() => onView(station.id)}
          onDelete={() => onDelete(station.id)}
        />
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}
