
/**
 * @file components/pumps/FuelPumpCard.tsx
 * @description Refactored fuel pump card using standard models and utilities
 */
import { Button } from '@/components/ui/button';
import { Fuel, Hash, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PumpModel } from '@/models/pump';
import type { PumpCardActions } from '@/models/pump-actions';
import { getPumpStatusConfig } from '@/utils/pump-config';
import { getPumpStatusLabel } from '@/models/pump';

interface FuelPumpCardProps {
  pump: PumpModel;
  actions: PumpCardActions;
  needsAttention?: boolean;
}

export function FuelPumpCard({ pump, actions, needsAttention }: Readonly<FuelPumpCardProps>) {
  const statusConfig = getPumpStatusConfig(pump.status);
  const attention = needsAttention || pump.needsAttention;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
      "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-blue-200 hover:ring-2 hover:ring-blue-300/50 hover:shadow-blue-200/40 shadow-xl hover:shadow-2xl",
      attention && "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-transparent animate-pulse"
    )}>
      {/* Animated Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-15 transition-opacity duration-500",
        statusConfig.gradient
      )}></div>

      {/* Attention Badge */}
      {attention && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-2 shadow-lg shadow-amber-300/50 animate-bounce">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      {/* Floating Pump Icon with Glow */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-300/30">
        <Fuel className="h-7 w-7 text-blue-600 drop-shadow-sm" />
        {pump.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                {pump.name}
              </h3>
              <div className="space-y-1">
                {pump.serialNumber && (
                  <p className="text-gray-600 flex items-center gap-2 text-sm">
                    <Hash className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate font-mono">{pump.serialNumber}</span>
                  </p>
                )}
                {pump.stationName && (
                  <p className="text-gray-500 text-xs truncate">
                    @ {pump.stationName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "inline-flex px-4 py-2 rounded-full border items-center gap-2 backdrop-blur-sm ring-1",
              statusConfig.bgColor
            )}>
              <StatusIcon className={cn("w-4 h-4", statusConfig.iconColor)} />
              <span className={cn("text-sm font-semibold", statusConfig.iconColor)}>
                {getPumpStatusLabel(pump.status)}
              </span>
            </div>
            {actions.onDelete && (
              <Button 
                onClick={() => actions.onDelete(pump.id)}
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 3D Pump Visualization */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/80 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Main Pump Body with Enhanced Styling */}
                <div className={cn(
                  "w-24 h-32 rounded-2xl shadow-2xl border relative overflow-hidden",
                  "bg-gradient-to-b from-gray-300 to-gray-500",
                  "border-gray-400/60"
                )}>
                  {/* Digital Display */}
                  <div className="absolute top-4 left-2 right-2 h-10 bg-gray-800 rounded-lg border border-blue-400/60 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="text-center">
                      <div className={cn(
                        "text-xs font-mono font-bold",
                        statusConfig.badge?.className
                      )}>
                        {pump.name.slice(0, 8)}
                      </div>
                      <div className="text-[8px] text-gray-400 mt-0.5">
                        {pump.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Status Light */}
                  <div className={cn(
                    "absolute top-16 right-2 w-3 h-3 rounded-full border-2 border-white/50 shadow-lg",
                    statusConfig.accentColor
                  )} />
                  
                  {/* Enhanced Nozzle Connections */}
                  <div className="absolute right-0 top-20 space-y-2">
                    {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-r-xl shadow-md border border-gray-400/60" />
                        <div className="w-6 h-2 bg-gradient-to-r from-blue-400/80 to-blue-500/80 rounded-r-full ml-1 shadow-sm" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Animated Flow Lines (when active) */}
                  {pump.status === 'active' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-20 left-4 w-1 h-8 bg-gradient-to-b from-blue-400/0 via-blue-400/80 to-blue-400/0 animate-pulse"></div>
                      <div className="absolute top-24 left-6 w-1 h-6 bg-gradient-to-b from-cyan-400/0 via-cyan-400/80 to-cyan-400/0 animate-pulse delay-300"></div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Base Platform */}
                <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-2xl shadow-xl border border-gray-400/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Nozzle Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                {pump.nozzleCount}
              </div>
              <span className="text-sm font-semibold text-gray-700">Nozzles</span>
            </div>
            {actions.onViewNozzles && (
              <Button 
                onClick={() => actions.onViewNozzles!(pump.id)}
                size="sm"
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
