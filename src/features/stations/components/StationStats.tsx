
/**
 * @file components/stations/StationStats.tsx
 * @description Clean station statistics with white theme - no yellow colors
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Fuel, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StationStatsProps {
  pumpCount: number;
  fuelPrices: Record<string, { price: number }>;
  pricesLoading: boolean;
}

export function StationStats({ pumpCount, fuelPrices, pricesLoading }: Readonly<StationStatsProps>) {
  const priceEntries = Object.entries(fuelPrices);

  return (
    <div className="space-y-4">
      {/* Pump Count Display */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Fuel className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-900">Pumps</span>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold bg-white border-gray-200">
          {pumpCount}
        </Badge>
      </div>

      {/* Fuel Prices Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-3 w-3 text-gray-600" />
          <h4 className="text-xs font-medium text-gray-900">Prices</h4>
        </div>

        {pricesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-8 w-full" />
            ))}
          </div>
        ) : priceEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {priceEntries.slice(0, 3).map(([fuelType, price]) => (
              <div key={fuelType} className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center gap-1.5">
                  {(() => {
                    let colorClass = 'bg-blue-500';
                    if (fuelType.toLowerCase().includes('petrol')) colorClass = 'bg-green-500';
                    else if (fuelType.toLowerCase().includes('diesel')) colorClass = 'bg-orange-500';
                    return <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />;
                  })()}
                  <span className="text-xs font-medium text-gray-900 capitalize">
                    {fuelType.slice(0, 6)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  ₹{price?.price ? price.price.toFixed(0) : '0'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
            <div className="text-center">
              <Activity className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No prices available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
