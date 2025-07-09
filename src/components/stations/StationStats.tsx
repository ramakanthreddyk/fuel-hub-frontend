
/**
 * @file components/stations/StationStats.tsx
 * @description Statistics sections for fuel dispensers and fuel prices
 */
import React from 'react';
import { Fuel, Star, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationStatsProps {
  pumpCount: number;
  fuelPrices: Record<string, any>;
  pricesLoading: boolean;
}

export function StationStats({ pumpCount, fuelPrices, pricesLoading }: StationStatsProps) {
  const hasPrices = Object.keys(fuelPrices).length > 0;

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case 'diesel': return { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' };
      case 'premium': return { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Fuel Dispensers */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-full bg-blue-500">
            <Fuel className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-blue-800">Fuel Dispensers</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-900">{pumpCount}</div>
          <div className="text-xs text-blue-700 font-medium">Active dispensers</div>
        </div>
      </div>
      
      {/* Fuel Prices */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-full bg-orange-500">
            <Star className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-orange-800">Current Fuel Prices</span>
        </div>
        
        {pricesLoading ? (
          <div className="text-sm text-orange-600">Loading prices...</div>
        ) : hasPrices ? (
          <div className="space-y-2">
            {Object.entries(fuelPrices).map(([fuelType, price]) => {
              const colors = getFuelTypeColor(fuelType);
              return (
                <div key={fuelType} className="flex items-center justify-between bg-white/60 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", colors.dot)}></div>
                    <span className="text-sm capitalize font-medium text-gray-800">{fuelType}</span>
                  </div>
                  <div className="font-bold text-gray-900">₹{parseFloat(price.price || 0).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600 bg-white/60 rounded-lg p-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Prices not set</span>
          </div>
        )}
      </div>
    </div>
  );
}
