
/**
 * @file components/nozzles/FuelNozzleCard.tsx
 * @description Creative fuel nozzle card with dark mode support and modern design
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Hash, 
  Activity, 
  Gauge, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Fuel,
  Sparkles,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FuelNozzleCardProps {
  nozzle: {
    id: string;
    nozzleNumber: number;
    fuelType: 'petrol' | 'diesel' | 'premium';
    status: 'active' | 'maintenance' | 'inactive';
    lastReading?: number;
    pumpName?: string;
  };
  onEdit: (nozzleId: string) => void;
  onDelete: (nozzleId: string) => void;
  onRecordReading: (nozzleId: string) => void;
}

export function FuelNozzleCard({ nozzle, onEdit, onDelete, onRecordReading }: FuelNozzleCardProps) {
  const getFuelTypeConfig = () => {
    switch (nozzle.fuelType) {
      case 'petrol':
        return {
          gradient: 'from-emerald-400 via-green-500 to-teal-600',
          glowColor: 'shadow-emerald-500/30',
          icon: Fuel,
          label: 'Petrol',
          emoji: '⛽',
          bgColor: 'bg-emerald-500/20 border-emerald-500/30',
          textColor: 'text-emerald-400'
        };
      case 'diesel':
        return {
          gradient: 'from-amber-400 via-orange-500 to-red-500',
          glowColor: 'shadow-amber-500/30',
          icon: Droplets,
          label: 'Diesel',
          emoji: '🛢️',
          bgColor: 'bg-amber-500/20 border-amber-500/30',
          textColor: 'text-amber-400'
        };
      case 'premium':
        return {
          gradient: 'from-purple-400 via-violet-500 to-indigo-600',
          glowColor: 'shadow-purple-500/30',
          icon: Sparkles,
          label: 'Premium',
          emoji: '✨',
          bgColor: 'bg-purple-500/20 border-purple-500/30',
          textColor: 'text-purple-400'
        };
      default:
        return {
          gradient: 'from-gray-400 via-slate-500 to-zinc-600',
          glowColor: 'shadow-gray-500/30',
          icon: Droplets,
          label: 'Unknown',
          emoji: '⛽',
          bgColor: 'bg-gray-500/20 border-gray-500/30',
          textColor: 'text-gray-400'
        };
    }
  };

  const getStatusConfig = () => {
    switch (nozzle.status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20 border-emerald-500/30'
        };
      case 'maintenance':
        return {
          icon: Clock,
          label: 'Maintenance',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20 border-amber-500/30'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20 border-red-500/30'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20 border-gray-500/30'
        };
    }
  };

  const fuelConfig = getFuelTypeConfig();
  const statusConfig = getStatusConfig();
  const FuelIcon = fuelConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]",
      "bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10",
      "shadow-2xl hover:shadow-3xl",
      fuelConfig.glowColor
    )}>
      {/* Animated Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500",
        fuelConfig.gradient
      )}></div>

      {/* Floating Fuel Icon */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
        <FuelIcon className={cn("h-6 w-6", fuelConfig.textColor)} />
        <span className="absolute -top-1 -right-1 text-lg">{fuelConfig.emoji}</span>
      </div>

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-white dark:text-white">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <div className="space-y-1">
                <div className={cn(
                  "inline-flex px-3 py-1 rounded-full border items-center gap-2 backdrop-blur-sm",
                  fuelConfig.bgColor
                )}>
                  <Hash className={cn("w-3 h-3", fuelConfig.textColor)} />
                  <span className={cn("text-xs font-semibold", fuelConfig.textColor)}>
                    {fuelConfig.label}
                  </span>
                </div>
                {nozzle.pumpName && (
                  <p className="text-slate-400 dark:text-slate-400 text-xs">
                    @ {nozzle.pumpName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "inline-flex px-3 py-1 rounded-full border items-center gap-2 backdrop-blur-sm",
            statusConfig.bgColor
          )}>
            <StatusIcon className={cn("w-3 h-3", statusConfig.color)} />
            <span className={cn("text-xs font-semibold", statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* 3D Nozzle Visualization */}
        <div className="relative">
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 dark:from-slate-900/50 dark:to-black/50 rounded-2xl p-6 border border-white/10 dark:border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Nozzle Handle */}
                <div className={cn(
                  "w-20 h-12 rounded-2xl shadow-xl border relative overflow-hidden",
                  "bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900",
                  "border-slate-600 dark:border-slate-700"
                )}>
                  {/* Grip Texture */}
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-xl">
                    <div className="absolute inset-1 bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 rounded-lg opacity-50"></div>
                  </div>
                  
                  {/* Digital Display */}
                  <div className="absolute top-1 left-2 right-2 h-6 bg-black rounded border border-slate-500 flex items-center justify-center">
                    <div className={cn(
                      "text-[8px] font-mono font-bold text-center",
                      nozzle.status === 'active' ? "text-green-400" : 
                      nozzle.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                    )}>
                      <div>{nozzle.lastReading ? `${nozzle.lastReading.toFixed(1)}L` : '0.0L'}</div>
                      <div className="text-[6px] text-gray-500">LAST</div>
                    </div>
                  </div>
                  
                  {/* Status LED */}
                  <div className={cn(
                    "absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white/20",
                    nozzle.status === 'active' ? "bg-emerald-400 animate-pulse shadow-emerald-400/50 shadow-sm" : 
                    nozzle.status === 'maintenance' ? "bg-amber-400 shadow-amber-400/50 shadow-sm" : 
                    "bg-red-400 shadow-red-400/50 shadow-sm"
                  )} />
                </div>
                
                {/* Nozzle Spout */}
                <div className="absolute -right-6 top-4 w-8 h-4 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-r-full border border-slate-600 dark:border-slate-700 shadow-lg">
                  <div className="absolute right-1 top-1 bottom-1 w-2 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-r-full"></div>
                </div>
                
                {/* Fuel Hose */}
                <div className="absolute -left-8 top-2 w-10 h-8 bg-gradient-to-l from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-l-2xl border border-slate-600 dark:border-slate-700 shadow-lg">
                  {/* Animated Flow (when active) */}
                  {nozzle.status === 'active' && (
                    <div className="absolute inset-1 bg-gradient-to-r from-cyan-400/20 to-transparent rounded-l-xl animate-pulse">
                      <Waves className="h-3 w-3 text-cyan-400/50 m-2 animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-xl", fuelConfig.bgColor)}>
                <FuelIcon className={cn("h-5 w-5", fuelConfig.textColor)} />
              </div>
              <span className="text-sm font-semibold text-slate-200 dark:text-slate-200">Type</span>
            </div>
            <div className="text-lg font-bold text-white dark:text-white capitalize">
              {nozzle.fuelType}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              Fuel grade
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 dark:bg-blue-500/20">
                <Gauge className="h-5 w-5 text-blue-400 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200 dark:text-slate-200">Reading</span>
            </div>
            <div className="text-lg font-bold text-white dark:text-white">
              {nozzle.lastReading ? `${nozzle.lastReading.toLocaleString()}L` : 'N/A'}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
              Last recorded
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            onClick={() => onRecordReading(nozzle.id)}
          >
            <Gauge className="w-4 h-4 mr-2" />
            Record New Reading
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/10 dark:bg-white/10 backdrop-blur-sm border-white/20 dark:border-white/20 text-white dark:text-white hover:bg-white/20 dark:hover:bg-white/20 hover:border-white/30 dark:hover:border-white/30 rounded-xl transition-all duration-300"
              onClick={() => onEdit(nozzle.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/10 dark:bg-white/10 backdrop-blur-sm border-white/20 dark:border-white/20 text-white dark:text-white hover:bg-red-500/20 dark:hover:bg-red-500/20 hover:border-red-500/30 dark:hover:border-red-500/30 hover:text-red-200 dark:hover:text-red-200 rounded-xl transition-all duration-300"
              onClick={() => onDelete(nozzle.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
