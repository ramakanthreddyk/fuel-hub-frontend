
/**
 * @file components/stations/StationStats.tsx
 * @description Clean station statistics with white theme - no yellow colors
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Fuel, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';

interface StationStatsProps {
  pumpCount: number;
  fuelPrices: Record<string, any>;
  pricesLoading: boolean;
}

export function StationStats({ pumpCount, fuelPrices, pricesLoading }: StationStatsProps) {
  const priceEntries = Object.entries(fuelPrices);

  return (
    <div className="space-y-4">
      {/* Pump Count Display */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <Fuel className="h-3 w-3 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Fuel Pumps</span>
        </div>
        <Badge variant="secondary" className="font-semibold bg-white border-gray-200">
          {pumpCount}
        </Badge>
      </div>

      {/* Fuel Prices Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gray-100 rounded-md">
            <TrendingUp className="h-3 w-3 text-gray-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-900">Current Prices</h4>
        </div>

        {pricesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : priceEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {priceEntries.slice(0, 3).map(([fuelType, price]) => (
              <div key={fuelType} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    fuelType.toLowerCase().includes('petrol') ? 'bg-green-500' :
                    fuelType.toLowerCase().includes('diesel') ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-xs font-medium text-gray-900 capitalize">
                    {fuelType}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs font-semibold bg-white border-gray-200">
                  {price?.price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(price.price) : '₹0.00'}
                </Badge>
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
