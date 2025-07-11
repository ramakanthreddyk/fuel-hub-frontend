
/**
 * @file components/stations/StationDashboardOverlay.tsx
 * @description Sophisticated hover overlay showing station metrics and real-time data
 */
import React from 'react';
import { 
  TrendingUp, 
  Fuel, 
  DollarSign, 
  Activity, 
  Clock,
  Users,
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
}: StationDashboardOverlayProps) {
  if (!isVisible) return null;

  const activePumps = pumps.filter(p => p.status === 'active').length;
  const totalNozzles = pumps.reduce((acc, pump) => acc + pump.nozzles.length, 0);
  const activeNozzles = pumps.reduce((acc, pump) => 
    acc + pump.nozzles.filter(n => n.status === 'active').length, 0
  );

  return (
    <div className="absolute inset-0 bg-card/95 backdrop-blur-sm border border-border rounded-3xl p-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground truncate">{stationName}</h3>
          <p className="text-xs text-muted-foreground">Live Dashboard</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-muted-foreground">Today's Sales</span>
          </div>
          <p className="text-sm font-bold text-foreground">₹{totalSales.toLocaleString()}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-muted-foreground">Transactions</span>
          </div>
          <p className="text-sm font-bold text-foreground">{todayTransactions}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <Fuel className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-medium text-muted-foreground">Active Pumps</span>
          </div>
          <p className="text-sm font-bold text-foreground">{activePumps}/{pumps.length}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-purple-600" />
            <span className="text-xs font-medium text-muted-foreground">Nozzles</span>
          </div>
          <p className="text-sm font-bold text-foreground">{activeNozzles}/{totalNozzles}</p>
        </div>
      </div>

      {/* Fuel Prices */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          Current Fuel Prices
        </h4>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(fuelPrices).slice(0, 3).map(([fuelType, price]) => (
            <Badge key={fuelType} variant="outline" className="text-xs">
              {fuelType}: ₹{price?.price || 0}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pump Status */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Fuel className="h-3 w-3" />
          Pump Status
        </h4>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {pumps.slice(0, 3).map((pump) => (
            <div key={pump.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  pump.status === 'active' ? 'bg-green-500' :
                  pump.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                )} />
                <span className="text-foreground truncate">{pump.name}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>{pump.nozzles.length}N</span>
                <span>₹{pump.todaySales?.toLocaleString() || 0}</span>
              </div>
            </div>
          ))}
          {pumps.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{pumps.length - 3} more pumps
            </p>
          )}
        </div>
      </div>

      {/* Average Transaction */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Avg. Transaction
          </span>
          <span className="font-medium text-foreground">₹{averageTransaction.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
