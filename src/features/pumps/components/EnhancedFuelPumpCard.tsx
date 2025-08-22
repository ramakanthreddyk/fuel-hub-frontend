
/**
 * @file components/pumps/EnhancedFuelPumpCard.tsx
 * @description Enhanced fuel pump card using standard models and utilities
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, Gauge, Settings, AlertTriangle, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PumpModel } from '@/models/pump';
import type { PumpCardActions } from '@/models/pump-actions';
import { getPumpStatusConfig } from '@/utils/pump-config';
import { getPumpStatusLabel } from '@/models/pump';

interface EnhancedFuelPumpCardProps {
  pump: PumpModel;
  actions: PumpCardActions;
}

export function EnhancedFuelPumpCard({ pump, actions }: Readonly<EnhancedFuelPumpCardProps>) {
  const statusConfig = getPumpStatusConfig(pump.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
              statusConfig.gradient
            )}>
              <Fuel className="h-6 w-6 text-white" />
              {pump.needsAttention && (
                <div className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">{pump.name}</CardTitle>
              {pump.serialNumber && (
                <p className="text-sm text-gray-500 font-medium">S/N: {pump.serialNumber}</p>
              )}
            </div>
          </div>
          <Badge variant={statusConfig.badge.variant} className={cn("gap-1", statusConfig.badge.className)}>
            <StatusIcon className="h-3 w-3" />
            {getPumpStatusLabel(pump.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enhanced Pump Visual */}
        <div className="relative p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border">
          <div className="flex items-center justify-center">
            {/* Main Pump Body */}
            <div className="relative">
              <div className="w-20 h-28 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-xl border border-slate-600">
                {/* Digital Display */}
                <div className="absolute top-3 left-2 right-2 h-8 bg-black rounded border border-slate-500 flex items-center justify-center">
                  <div className="text-green-400 font-mono text-xs text-center leading-tight">
                    <div className="text-[8px] opacity-75">PUMP</div>
                    <div className="font-bold">{pump.name}</div>
                  </div>
                </div>
                
                {/* Status Light */}
                <div className={cn(
                  "absolute top-12 right-1 w-2 h-2 rounded-full",
                  (() => {
                    if (pump.status === 'active') return "bg-green-400 animate-pulse";
                    if (pump.status === 'maintenance') return "bg-amber-400";
                    return "bg-gray-400";
                  })()
                )} />
                
                {/* Nozzle Connections */}
                <div className="absolute right-0 top-16 space-y-1">
                  {Array.from({ length: Math.min(pump.nozzleCount, 4) }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-6 h-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-r-md shadow-sm" />
                      <div className="w-4 h-1.5 bg-gradient-to-r from-slate-500 to-slate-600 rounded-r-full ml-1" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Base Platform */}
              <div className="absolute -bottom-1 -left-1 -right-1 h-3 bg-gradient-to-b from-slate-600 to-slate-700 rounded-b-lg shadow-lg" />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Gauge className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-700">{pump.nozzleCount}</div>
              <div className="text-xs text-blue-600 font-medium">Nozzles</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <Zap className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-lg font-bold text-emerald-700">
                {(() => {
                  if (pump.status === 'active') return 'Ready';
                  if (pump.status === 'maintenance') return 'Service';
                  return 'Offline';
                })()}
              </div>
              <div className="text-xs text-emerald-600 font-medium">Status</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {actions.onViewNozzles && (
            <Button 
              onClick={() => actions.onViewNozzles?.(pump.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
              size="sm"
            >
              <Gauge className="h-4 w-4 mr-2" />
              View Nozzles
            </Button>
          )}
          
          {actions.onSettings && (
            <Button 
              onClick={() => actions.onSettings?.(pump.id)}
              variant="outline"
              size="sm"
              className="hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}