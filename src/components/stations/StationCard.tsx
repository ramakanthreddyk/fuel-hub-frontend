
/**
 * @file components/stations/StationCard.tsx
 * @description Enhanced station card with professional design and dashboard overlay
 */
import React, { useState } from 'react';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { usePumps } from '@/hooks/api/usePumps';
import { useEnhancedSales } from '@/hooks/useEnhancedSales';
import { StationHeader } from './StationHeader';
import { StationVisual } from './StationVisual';
import { StationStats } from './StationStats';
import { StationActions } from './StationActions';
import { StationDashboardOverlay } from './StationDashboardOverlay';

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
  const [showDashboard, setShowDashboard] = useState(false);
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

  // Calculate metrics for dashboard
  const todaySales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const todayTransactions = sales.length;
  const averageTransaction = todayTransactions > 0 ? todaySales / todayTransactions : 0;

  // Transform pumps data for dashboard
  const pumpData = pumps.map(pump => ({
    id: pump.id,
    name: pump.name,
    nozzles: [], // Would be populated from nozzles API
    todaySales: Math.random() * 50000, // Mock data
    status: pump.status
  }));

  return (
    <div 
      className="group relative bg-white border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
      onMouseEnter={() => setShowDashboard(true)}
      onMouseLeave={() => setShowDashboard(false)}
    >
      
      {/* Status Indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
        station.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/30' :
        station.status === 'maintenance' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30' :
        'bg-red-500 shadow-lg shadow-red-500/30'
      } animate-pulse`}></div>

      {/* Dashboard Overlay */}
      <StationDashboardOverlay
        stationId={station.id}
        stationName={station.name}
        pumps={pumpData}
        totalSales={todaySales}
        todayTransactions={todayTransactions}
        averageTransaction={averageTransaction}
        fuelPrices={processedPrices}
        isVisible={showDashboard}
      />

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

      {/* Stats Sections */}
      <div className="relative z-10 px-6 space-y-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">
        <StationStats
          pumpCount={station.pumpCount}
          fuelPrices={processedPrices}
          pricesLoading={pricesLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 p-6 pt-4">
        <StationActions
          onView={() => onView(station.id)}
          onDelete={() => onDelete(station.id)}
        />
      </div>

      {/* Hover Hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Hover for details
      </div>
    </div>
  );
}
