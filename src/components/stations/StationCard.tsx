
/**
 * @file components/stations/StationCard.tsx
 * @description Clean station card with proper styling and subtle hover effects
 */
import React from 'react';
import type { Station, EntityStatus } from '@/api/api-contract';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { usePumps } from '@/hooks/api/usePumps';
import { useEnhancedSales } from '@/hooks/useEnhancedSales';
import { StationHeader } from './StationHeader';
import { StationVisual } from './StationVisual';
import { StationStats } from './StationStats';
import { StationActions } from './StationActions';
import { StationQuickStats } from './StationQuickStats';

interface StationCardProps {
  station: Station;
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
}

export function StationCard({ station, onView, onDelete }: StationCardProps) {
  const { data: fuelPrices = [], isLoading: pricesLoading } = useFuelPrices(station.id);
  const { data: pumps = [] } = usePumps(station.id);
  const { data: sales = [] } = useEnhancedSales({ stationId: station.id });

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

  // Calculate metrics
  const todaySales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const todayTransactions = sales.length;
  const activePumps = pumps.filter(p => p.status === 'active').length;

  return (
    <div className="group relative bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1">
      
      {/* Status Indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
        station.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/30' :
        station.status === 'maintenance' ? 'bg-orange-500 shadow-lg shadow-orange-500/30' :
        'bg-red-500 shadow-lg shadow-red-500/30'
      } animate-pulse`}></div>

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
          pumpCount={station.pumps.length}
        />
      </div>

      {/* Quick Stats Bar - Shows on hover */}
      <div className="px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <StationQuickStats
          totalSales={todaySales}
          transactions={todayTransactions}
          activePumps={activePumps}
          totalPumps={pumps.length}
        />
      </div>

      {/* Stats Sections */}
      <div className="px-6 space-y-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">
        <StationStats
          pumpCount={station.pumps.length}
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

      {/* Subtle Hover Enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
}
