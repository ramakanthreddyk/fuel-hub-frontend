
/**
 * @file components/pumps/FuelPumpCard.tsx
 * @description Creative fuel pump card with dark mode support and modern design
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

interface FuelPumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: 'active' | 'maintenance' | 'inactive';
    nozzleCount: number;
    stationName?: string;
  };
  onViewNozzles: (pumpId: string) => void;
  onDelete: (pumpId: string) => void;
  needsAttention?: boolean;
}

export function FuelPumpCard({ pump, onViewNozzles, onDelete, needsAttention }: FuelPumpCardProps) {
  const getStatusConfig = () => {
    switch (pump.status) {
      case 'active':
        return {
          gradient: 'from-emerald-400 via-green-500 to-teal-600',
          glowColor: 'shadow-emerald-500/30',
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/30 border-emerald-500/50'
        };
      case 'maintenance':
        return {
          gradient: 'from-amber-400 via-orange-500 to-red-500',
          glowColor: 'shadow-amber-500/30',
          icon: Settings2,
          label: 'Maintenance',
          iconColor: 'text-amber-400',
          bgColor: 'bg-amber-500/30 border-amber-500/50'
        };
      case 'inactive':
        return {
          gradient: 'from-red-400 via-pink-500 to-rose-500',
          glowColor: 'shadow-red-500/30',
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/30 border-red-500/50'
        };
      default:
        return {
          gradient: 'from-gray-400 via-slate-500 to-zinc-500',
          glowColor: 'shadow-gray-500/30',
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-400',
          bgColor: 'bg-gray-500/30 border-gray-500/50'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]",
      "bg-slate-800/80 dark:bg-slate-900/80 border-slate-600/30 dark:border-slate-700/30",
      "shadow-2xl hover:shadow-3xl",
      statusConfig.glowColor,
      needsAttention && "ring-2 ring-amber-400/50 ring-offset-2 ring-offset-transparent"
    )}>
      {/* Animated Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500",
        statusConfig.gradient
      )}></div>

      {/* Attention Badge */}
      {needsAttention && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-900 rounded-full p-2 shadow-lg shadow-amber-500/50 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      {/* Floating Pump Icon */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Fuel className={cn("h-7 w-7", statusConfig.iconColor)} />
      </div>

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-white dark:text-white truncate">
                {pump.name}
              </h3>
              <div className="space-y-1">
                {pump.serialNumber && (
                  <p className="text-slate-300 dark:text-slate-300 flex items-center gap-2 text-sm">
                    <Hash className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate font-mono">{pump.serialNumber}</span>
                  </p>
                )}
                {pump.stationName && (
                  <p className="text-slate-400 dark:text-slate-400 text-xs truncate">
                    @ {pump.stationName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "inline-flex px-3 py-1 rounded-full border items-center gap-2 backdrop-blur-sm",
            statusConfig.bgColor
          )}>
            <StatusIcon className={cn("w-3 h-3", statusConfig.iconColor)} />
            <span className={cn("text-xs font-semibold", statusConfig.iconColor)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* 3D Pump Visualization */}
        <div className="relative">
          <div className="bg-gradient-to-b from-slate-700/60 to-slate-800/60 dark:from-slate-800/60 dark:to-slate-900/60 rounded-2xl p-6 border border-white/20 dark:border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Main Pump Body */}
                <div className={cn(
                  "w-24 h-32 rounded-2xl shadow-xl border relative overflow-hidden",
                  "bg-gradient-to-b from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800",
                  "border-slate-500 dark:border-slate-600"
                )}>
                  {/* Digital Display */}
                  <div className="absolute top-4 left-2 right-2 h-10 bg-black rounded-lg border border-slate-400 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <div className={cn(
                        "text-xs font-mono font-bold",
                        pump.status === 'active' ? "text-green-400 animate-pulse" : 
                        pump.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                      )}>
                        {pump.name.slice(0, 8)}
                      </div>
                      <div className="text-[8px] text-gray-500 mt-0.5">
                        {pump.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Light */}
                  <div className={cn(
                    "absolute top-16 right-2 w-3 h-3 rounded-full border-2 border-white/20",
                    pump.status === 'active' ? "bg-emerald-400 animate-pulse shadow-emerald-400/50 shadow-lg" : 
                    pump.status === 'maintenance' ? "bg-amber-400 shadow-amber-400/50 shadow-lg" : 
                    "bg-red-400 shadow-red-400/50 shadow-lg"
                  )} />
                  
                  {/* Nozzle Connections */}
                  <div className="absolute right-0 top-20 space-y-2">
                    {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-3 bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 rounded-r-xl shadow-sm border border-slate-400" />
                        <div className="w-6 h-2 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 rounded-r-full ml-1 shadow-sm" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Animated Flow Lines (when active) */}
                  {pump.status === 'active' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-20 left-4 w-1 h-8 bg-gradient-to-b from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 animate-pulse"></div>
                      <div className="absolute top-24 left-6 w-1 h-6 bg-gradient-to-b from-blue-400/0 via-blue-400/50 to-blue-400/0 animate-pulse delay-300"></div>
                    </div>
                  )}
                </div>
                
                {/* Base Platform */}
                <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-gradient-to-b from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 rounded-b-2xl shadow-xl border border-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/30 dark:bg-blue-500/30">
                <Droplets className="h-5 w-5 text-blue-400 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200 dark:text-slate-200">Nozzles</span>
            </div>
            <div className="text-2xl font-bold text-white dark:text-white">
              {pump.nozzleCount}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              Connected dispensers
            </div>
          </div>
          
          <div className="bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/30 dark:bg-purple-500/30">
                <Gauge className="h-5 w-5 text-purple-400 dark:text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200 dark:text-slate-200 truncate">Status</span>
            </div>
            <div className="text-lg font-bold text-white dark:text-white capitalize truncate">
              {pump.status}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1 truncate">
              Current state
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onViewNozzles(pump.id)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Nozzles
          </Button>
          <Button 
            onClick={() => onDelete(pump.id)}
            variant="outline"
            className="bg-white/20 dark:bg-white/20 backdrop-blur-sm border-white/30 dark:border-white/30 text-white dark:text-white hover:bg-red-500/30 dark:hover:bg-red-500/30 hover:border-red-500/40 dark:hover:border-red-500/40 hover:text-red-200 dark:hover:text-red-200 rounded-xl transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
