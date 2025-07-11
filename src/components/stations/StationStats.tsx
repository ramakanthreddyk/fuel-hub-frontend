
/**
 * @file components/stations/StationStats.tsx
 * @description Professional station statistics display with refined styling
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Fuel, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Fuel className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Fuel Pumps</span>
        </div>
        <Badge variant="secondary" className="font-semibold">
          {pumpCount}
        </Badge>
      </div>

      {/* Fuel Prices Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-secondary/50 rounded-md">
            <TrendingUp className="h-3 w-3 text-secondary-foreground" />
          </div>
          <h4 className="text-sm font-medium text-foreground">Current Prices</h4>
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
              <div key={fuelType} className="flex items-center justify-between p-2 bg-card border border-border/30 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    fuelType.toLowerCase().includes('petrol') ? 'bg-green-500' :
                    fuelType.toLowerCase().includes('diesel') ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-xs font-medium text-foreground capitalize">
                    {fuelType}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  ₹{price?.price?.toFixed(2) || '0.00'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg border border-border/30 border-dashed">
            <div className="text-center">
              <Activity className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">No prices available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
