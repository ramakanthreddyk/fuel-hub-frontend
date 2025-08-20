
/**
 * @file components/pumps/FuelPumpCard.tsx
 * @description Creative fuel pump card with white theme and enhanced readability
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Fuel, 
  Hash, 
  Activity, 
  Eye, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Settings2,
  Zap,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFuelStore } from '@/store/fuelStore';

import type { Pump } from '@/api/api-contract';

interface FuelPumpCardProps {
  pump: Pump & { nozzleCount: number; serialNumber?: string; stationName?: string };
  onViewNozzles: (pumpId: string) => void;
  onDelete: (pumpId: string) => void;
  needsAttention?: boolean;
}

export function FuelPumpCard({ pump, onViewNozzles, onDelete, needsAttention }: FuelPumpCardProps) {
  // Get selectPump function from store
  const { selectPump } = useFuelStore();
  // Get card variant based on pump ID for visual variety
  const getCardVariant = (id: string) => {
    const variants = [
      {
        name: 'primary',
        bg: 'from-blue-50 via-indigo-50 to-blue-50',
        border: 'border-blue-200',
        glow: 'hover:ring-2 hover:ring-blue-300/50 hover:shadow-blue-200/40'
      },
      {
        name: 'secondary', 
        bg: 'from-teal-50 via-cyan-50 to-teal-50',
        border: 'border-teal-200',
        glow: 'hover:ring-2 hover:ring-teal-300/50 hover:shadow-teal-200/40'
      },
      {
        name: 'highlight',
        bg: 'from-purple-50 via-indigo-50 to-purple-50', 
        border: 'border-purple-200',
        glow: 'hover:ring-2 hover:ring-purple-300/50 hover:shadow-purple-200/40'
      }
    ];
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return variants[hash % variants.length];
  };

  const getStatusConfig = () => {
    switch (pump.status) {
      case 'active':
        return {
          gradient: 'from-emerald-500 via-green-600 to-teal-700',
          glowColor: 'shadow-emerald-200/60',
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-100/80 border-emerald-300/60 ring-emerald-300/30',
          textColor: 'text-emerald-700'
        };
      case 'maintenance':
        return {
          gradient: 'from-amber-500 via-orange-600 to-red-600',
          glowColor: 'shadow-amber-200/60',
          icon: Settings2,
          label: 'Maintenance',
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-100/80 border-amber-300/60 ring-amber-300/30',
          textColor: 'text-amber-700'
        };
      case 'inactive':
        return {
          gradient: 'from-red-500 via-pink-600 to-rose-600',
          glowColor: 'shadow-red-200/60',
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100/80 border-red-300/60 ring-red-300/30',
          textColor: 'text-red-700'
        };
      default:
        return {
          gradient: 'from-gray-500 via-slate-600 to-zinc-600',
          glowColor: 'shadow-gray-200/60',
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100/80 border-gray-300/60 ring-gray-300/30',
          textColor: 'text-gray-700'
        };
    }
  };

  const cardVariant = getCardVariant(pump.id);
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
      `bg-gradient-to-br ${cardVariant.bg}`,
      cardVariant.border,
      cardVariant.glow,
      "shadow-xl hover:shadow-2xl",
      statusConfig.glowColor,
      needsAttention && "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-transparent animate-pulse"
    )}>
      {/* Animated Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-15 transition-opacity duration-500",
        statusConfig.gradient
      )}></div>

      {/* Attention Badge */}
      {needsAttention && (
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
              <span className={cn("text-sm font-semibold", statusConfig.textColor)}>
                {statusConfig.label}
              </span>
            </div>
            <Button 
              onClick={() => onDelete(pump.id)}
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
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
                        pump.status === 'active' ? "text-blue-400 animate-pulse" : 
                        pump.status === 'maintenance' ? "text-amber-400" : "text-red-400"
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
                    pump.status === 'active' ? "bg-emerald-500 animate-pulse shadow-emerald-300/80" : 
                    pump.status === 'maintenance' ? "bg-amber-500 shadow-amber-300/80" : 
                    "bg-red-500 shadow-red-300/80"
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
            <Button 
              onClick={() => onViewNozzles(pump.id)}
              size="sm"
              variant="outline"
              className="bg-white/60 backdrop-blur-sm border border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </div>


      </div>
    </div>
  );
}
