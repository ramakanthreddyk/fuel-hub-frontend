
/**
 * @file components/pumps/FuelPumpCard.tsx
 * @description Creative fuel pump card with enhanced theming and dark mode support
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
  // Get card variant based on pump ID for visual variety
  const getCardVariant = (id: string) => {
    const variants = [
      {
        name: 'primary',
        bg: 'from-slate-800/90 via-slate-800/80 to-slate-900/90',
        border: 'border-slate-600/40',
        glow: 'hover:ring-2 hover:ring-cyan-400/50 hover:shadow-cyan-400/20'
      },
      {
        name: 'secondary', 
        bg: 'from-slate-700/90 via-slate-800/80 to-slate-800/90',
        border: 'border-slate-500/40',
        glow: 'hover:ring-2 hover:ring-teal-400/50 hover:shadow-teal-400/20'
      },
      {
        name: 'highlight',
        bg: 'from-slate-800/90 via-indigo-900/20 to-slate-900/90', 
        border: 'border-indigo-500/30',
        glow: 'hover:ring-2 hover:ring-purple-400/50 hover:shadow-purple-400/20'
      }
    ];
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return variants[hash % variants.length];
  };

  const getStatusConfig = () => {
    switch (pump.status) {
      case 'active':
        return {
          gradient: 'from-emerald-400 via-green-500 to-teal-600',
          glowColor: 'shadow-emerald-500/30',
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20 border-emerald-400/50 ring-emerald-400/30',
          textColor: 'text-emerald-300'
        };
      case 'maintenance':
        return {
          gradient: 'from-amber-400 via-orange-500 to-red-500',
          glowColor: 'shadow-amber-500/30',
          icon: Settings2,
          label: 'Maintenance',
          iconColor: 'text-amber-400',
          bgColor: 'bg-amber-500/20 border-amber-400/50 ring-amber-400/30',
          textColor: 'text-amber-300'
        };
      case 'inactive':
        return {
          gradient: 'from-red-400 via-pink-500 to-rose-500',
          glowColor: 'shadow-red-500/30',
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/20 border-red-400/50 ring-red-400/30',
          textColor: 'text-red-300'
        };
      default:
        return {
          gradient: 'from-gray-400 via-slate-500 to-zinc-500',
          glowColor: 'shadow-gray-500/30',
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-400',
          bgColor: 'bg-gray-500/20 border-gray-400/50 ring-gray-400/30',
          textColor: 'text-gray-300'
        };
    }
  };

  const cardVariant = getCardVariant(pump.id);
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]",
      `bg-gradient-to-br ${cardVariant.bg}`,
      cardVariant.border,
      cardVariant.glow,
      "shadow-2xl hover:shadow-3xl",
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
        <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-900 rounded-full p-2 shadow-lg shadow-amber-500/50 animate-bounce">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      {/* Floating Pump Icon with Glow */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-cyan-400/20">
        <Fuel className="h-7 w-7 text-cyan-400 drop-shadow-lg" />
        {pump.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-white dark:text-white truncate group-hover:text-cyan-300 transition-colors">
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
            "inline-flex px-4 py-2 rounded-full border items-center gap-2 backdrop-blur-sm ring-1",
            statusConfig.bgColor
          )}>
            <StatusIcon className={cn("w-4 h-4", statusConfig.iconColor)} />
            <span className={cn("text-sm font-semibold", statusConfig.textColor)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* 3D Pump Visualization */}
        <div className="relative">
          <div className="bg-gradient-to-b from-slate-700/60 to-slate-800/80 dark:from-slate-800/60 dark:to-slate-900/80 rounded-2xl p-6 border border-white/10 dark:border-white/10 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Main Pump Body with Enhanced Styling */}
                <div className={cn(
                  "w-24 h-32 rounded-2xl shadow-2xl border relative overflow-hidden",
                  "bg-gradient-to-b from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900",
                  "border-slate-400/50 dark:border-slate-500/50"
                )}>
                  {/* Digital Display */}
                  <div className="absolute top-4 left-2 right-2 h-10 bg-black rounded-lg border border-cyan-400/50 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="text-center">
                      <div className={cn(
                        "text-xs font-mono font-bold",
                        pump.status === 'active' ? "text-cyan-400 animate-pulse" : 
                        pump.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                      )}>
                        {pump.name.slice(0, 8)}
                      </div>
                      <div className="text-[8px] text-gray-500 mt-0.5">
                        {pump.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Status Light */}
                  <div className={cn(
                    "absolute top-16 right-2 w-3 h-3 rounded-full border-2 border-white/30 shadow-lg",
                    pump.status === 'active' ? "bg-emerald-400 animate-pulse shadow-emerald-400/80" : 
                    pump.status === 'maintenance' ? "bg-amber-400 shadow-amber-400/80" : 
                    "bg-red-400 shadow-red-400/80"
                  )} />
                  
                  {/* Enhanced Nozzle Connections */}
                  <div className="absolute right-0 top-20 space-y-2">
                    {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-3 bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-800 rounded-r-xl shadow-md border border-slate-400/50" />
                        <div className="w-6 h-2 bg-gradient-to-r from-cyan-400/70 to-cyan-500/70 dark:from-cyan-500/70 dark:to-cyan-600/70 rounded-r-full ml-1 shadow-sm" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Animated Flow Lines (when active) */}
                  {pump.status === 'active' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-20 left-4 w-1 h-8 bg-gradient-to-b from-cyan-400/0 via-cyan-400/60 to-cyan-400/0 animate-pulse"></div>
                      <div className="absolute top-24 left-6 w-1 h-6 bg-gradient-to-b from-blue-400/0 via-blue-400/60 to-blue-400/0 animate-pulse delay-300"></div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Base Platform */}
                <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-gradient-to-b from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-800 rounded-b-2xl shadow-xl border border-slate-400/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 dark:border-cyan-400/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 dark:bg-cyan-500/30 ring-1 ring-cyan-400/30">
                <Droplets className="h-5 w-5 text-cyan-400 dark:text-cyan-300" />
              </div>
              <span className="text-sm font-semibold text-cyan-200 dark:text-cyan-100">Nozzles</span>
            </div>
            <div className="text-2xl font-bold text-white dark:text-white">
              {pump.nozzleCount}
            </div>
            <div className="text-xs text-slate-300 dark:text-slate-300 mt-1">
              Connected dispensers
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/20 dark:border-purple-400/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/20 dark:bg-purple-500/30 ring-1 ring-purple-400/30">
                <Gauge className="h-5 w-5 text-purple-400 dark:text-purple-300" />
              </div>
              <span className="text-sm font-semibold text-purple-200 dark:text-purple-100 truncate">Status</span>
            </div>
            <div className="text-lg font-bold text-white dark:text-white capitalize truncate">
              {pump.status}
            </div>
            <div className="text-xs text-slate-300 dark:text-slate-300 mt-1 truncate">
              Current state
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onViewNozzles(pump.id)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 ring-2 ring-cyan-400/20 hover:ring-cyan-300/40"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Nozzles
          </Button>
          <Button 
            onClick={() => onDelete(pump.id)}
            variant="outline"
            className="bg-white/10 dark:bg-white/10 backdrop-blur-sm border-red-400/30 dark:border-red-400/40 text-red-300 dark:text-red-200 hover:bg-red-500/20 dark:hover:bg-red-500/30 hover:border-red-400/60 dark:hover:border-red-400/70 hover:text-red-100 dark:hover:text-red-100 rounded-xl transition-all duration-300 ring-1 ring-red-400/20 hover:ring-red-400/40"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
