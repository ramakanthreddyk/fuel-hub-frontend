
/**
 * @file components/stations/StationQuickStats.tsx
 * @description Quick stats that appear on hover - clean and minimal
 */
import React from 'react';
import { DollarSign, Activity, Fuel } from 'lucide-react';

interface StationQuickStatsProps {
  totalSales: number;
  transactions: number;
  activePumps: number;
  totalPumps: number;
}

export function StationQuickStats({ 
  totalSales, 
  transactions, 
  activePumps, 
  totalPumps 
}: StationQuickStatsProps) {
  return (
    <div className="bg-muted/50 border rounded-lg p-3">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-xs text-muted-foreground">Sales</span>
          </div>
          <p className="text-sm font-semibold text-foreground">₹{totalSales.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Activity className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">Trans.</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{transactions}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Fuel className="h-3 w-3 text-orange-600" />
            <span className="text-xs text-muted-foreground">Pumps</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{activePumps}/{totalPumps}</p>
        </div>
      </div>
    </div>
  );
}
