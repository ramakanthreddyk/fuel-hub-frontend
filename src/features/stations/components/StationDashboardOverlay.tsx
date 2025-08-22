
/**
 * @file components/stations/StationDashboardOverlay.tsx
 * @description Clean dashboard overlay with white theme - no yellow colors
 */
import React from 'react';
import { 
  TrendingUp, 
  Fuel, 
  DollarSign, 
  Activity, 
  BarChart3,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PumpData {
  id: string;
  name: string;
  nozzles: Array<{
    id: string;
    number: number;
    fuelType: string;
    lastReading: number;
    status: 'active' | 'inactive' | 'maintenance';
  }>;
  todaySales: number;
  status: 'active' | 'inactive' | 'maintenance';
}

interface StationDashboardOverlayProps {
  stationId: string;
  stationName: string;
  pumps: PumpData[];
  totalSales: number;
  todayTransactions: number;
  averageTransaction: number;
  fuelPrices: Record<string, any>;
  isVisible: boolean;
}

export function StationDashboardOverlay({
  stationId,
  stationName,
  pumps,
  totalSales,
  todayTransactions,
  averageTransaction,
  fuelPrices,
  isVisible
}: Readonly<StationDashboardOverlayProps>) {
  if (!isVisible) return null;

  const activePumps = pumps.filter(p => p.status === 'active').length;
  const totalNozzles = pumps.reduce((acc, pump) => acc + pump.nozzles.length, 0);
  const activeNozzles = pumps.reduce((acc, pump) => 
    acc + pump.nozzles.filter(n => n.status === 'active').length, 0
  );

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-3xl p-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">{stationName}</h3>
          <p className="text-xs text-gray-500">Live Dashboard</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Today's Sales</span>
          </div>
          <p className="text-sm font-bold text-gray-900">₹{totalSales.toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Transactions</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{todayTransactions}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Fuel className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Active Pumps</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{activePumps}/{pumps.length}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-purple-600" />
            <span className="text-xs font-medium text-gray-600">Nozzles</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{activeNozzles}/{totalNozzles}</p>
        </div>
      </div>

      {/* Fuel Prices */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          Current Fuel Prices
        </h4>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(fuelPrices).slice(0, 3).map(([fuelType, price]) => (
            <Badge key={fuelType} variant="outline" className="text-xs bg-white border-gray-200">
              {fuelType}: ₹{price?.price || 0}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pump Status */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-600 flex items-center gap-1">
          <Fuel className="h-3 w-3" />
          Pump Status
        </h4>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {pumps.slice(0, 3).map((pump) => (
            <div key={pump.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  (() => {
                    if (pump.status === 'active') return 'bg-green-500';
                    if (pump.status === 'maintenance') return 'bg-orange-500';
                    return 'bg-red-500';
                  })()
                )} />
                <span className="text-gray-900 truncate">{pump.name}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <span>{pump.nozzles.length}N</span>
                <span>₹{pump.todaySales?.toLocaleString() || 0}</span>
              </div>
            </div>
          ))}
          {pumps.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{pumps.length - 3} more pumps
            </p>
          )}
        </div>
      </div>

      {/* Average Transaction */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Avg. Transaction
          </span>
          <span className="font-medium text-gray-900">₹{averageTransaction.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
