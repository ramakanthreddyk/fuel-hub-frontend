
/**
 * @file components/nozzles/FuelNozzleCard.tsx
 * @description Creative fuel nozzle card with white theme and enhanced readability
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Hash, 
  Activity, 
  Eye, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Settings2,
  Zap,
  Gauge,
  FileText
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
  // Get card variant based on fuel type
  const getFuelTypeConfig = () => {
    switch (nozzle.fuelType) {
      case 'petrol':
        return {
          bg: 'from-emerald-50 via-green-50 to-teal-50',
          border: 'border-emerald-200',
          glow: 'hover:ring-2 hover:ring-emerald-300/50 hover:shadow-emerald-200/40',
          icon: '⛽',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100/80'
        };
      case 'diesel':
        return {
          bg: 'from-amber-50 via-orange-50 to-yellow-50',
          border: 'border-amber-200',
          glow: 'hover:ring-2 hover:ring-amber-300/50 hover:shadow-amber-200/40',
          icon: '🛢️',
          color: 'text-amber-600',
          bgColor: 'bg-amber-100/80'
        };
      case 'premium':
        return {
          bg: 'from-purple-50 via-indigo-50 to-violet-50',
          border: 'border-purple-200',
          glow: 'hover:ring-2 hover:ring-purple-300/50 hover:shadow-purple-200/40',
          icon: '✨',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100/80'
        };
    }
  };

  const getStatusConfig = () => {
    switch (nozzle.status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-100/80 border-emerald-300/60',
          textColor: 'text-emerald-700'
        };
      case 'maintenance':
        return {
          icon: Settings2,
          label: 'Maintenance',
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-100/80 border-amber-300/60',
          textColor: 'text-amber-700'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100/80 border-red-300/60',
          textColor: 'text-red-700'
        };
    }
  };

  const fuelConfig = getFuelTypeConfig();
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
      `bg-gradient-to-br ${fuelConfig.bg}`,
      fuelConfig.border,
      fuelConfig.glow,
      "shadow-xl hover:shadow-2xl"
    )}>
      {/* Fuel type indicator */}
      <div className="absolute top-4 left-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg",
          fuelConfig.bgColor,
          fuelConfig.color
        )}>
          {fuelConfig.icon}
        </div>
      </div>

      {/* Floating Nozzle Icon */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-300/30">
        <Droplets className="h-7 w-7 text-blue-600 drop-shadow-sm" />
        {nozzle.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative p-8 space-y-6 pt-16">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-gray-800 group-hover:text-blue-700 transition-colors">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <div className="space-y-1">
                {nozzle.pumpName && (
                  <p className="text-gray-600 flex items-center gap-2 text-sm">
                    <Fuel className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{nozzle.pumpName}</span>
                  </p>
                )}
                <p className="text-gray-500 text-xs capitalize">
                  {nozzle.fuelType} Dispenser
                </p>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "inline-flex px-4 py-2 rounded-full border items-center gap-2 backdrop-blur-sm",
            statusConfig.bgColor
          )}>
            <StatusIcon className={cn("w-4 h-4", statusConfig.iconColor)} />
            <span className={cn("text-sm font-semibold", statusConfig.textColor)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* 3D Nozzle Visualization */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/80 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Nozzle Handle */}
                <div className={cn(
                  "w-20 h-24 rounded-2xl shadow-2xl border relative overflow-hidden",
                  "bg-gradient-to-b from-gray-300 to-gray-500",
                  "border-gray-400/60"
                )}>
                  {/* Display Screen */}
                  <div className="absolute top-3 left-2 right-2 h-8 bg-gray-800 rounded-lg border border-blue-400/60 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="text-center">
                      <div className={cn(
                        "text-xs font-mono font-bold",
                        nozzle.status === 'active' ? "text-blue-400 animate-pulse" : 
                        nozzle.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                      )}>
                        #{nozzle.nozzleNumber}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Light */}
                  <div className={cn(
                    "absolute top-12 right-2 w-3 h-3 rounded-full border-2 border-white/50 shadow-lg",
                    nozzle.status === 'active' ? "bg-emerald-500 animate-pulse shadow-emerald-300/80" : 
                    nozzle.status === 'maintenance' ? "bg-amber-500 shadow-amber-300/80" : 
                    "bg-red-500 shadow-red-300/80"
                  )} />
                  
                  {/* Nozzle Hose */}
                  <div className="absolute right-0 top-16 w-6 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-r-xl shadow-md border border-gray-400/60" />
                  
                  {/* Flow indicator (when active) */}
                  {nozzle.status === 'active' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-16 left-3 w-1 h-6 bg-gradient-to-b from-blue-400/0 via-blue-400/80 to-blue-400/0 animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
                <Gauge className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Last Reading</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {nozzle.lastReading ? `${nozzle.lastReading.toLocaleString()}L` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Meter reading
            </div>
          </div>
          
          <div className={cn(
            "backdrop-blur-sm rounded-2xl p-4 border",
            fuelConfig.bgColor,
            fuelConfig.border.replace('border-', 'border-').replace('-200', '-200/60')
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-xl ring-1",
                fuelConfig.color.replace('text-', 'bg-').replace('-600', '-500/20'),
                fuelConfig.color.replace('text-', 'ring-').replace('-600', '-400/30')
              )}>
                <Fuel className={cn("h-5 w-5", fuelConfig.color)} />
              </div>
              <span className={cn("text-sm font-semibold", fuelConfig.color.replace('-600', '-700'))}>
                Fuel Type
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800 capitalize">
              {nozzle.fuelType}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Dispenser type
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onRecordReading(nozzle.id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Record Reading
          </Button>
          <Button 
            onClick={() => onEdit(nozzle.id)}
            variant="outline"
            className="bg-blue-50/80 backdrop-blur-sm border-blue-300/60 text-blue-600 hover:bg-blue-100/80 hover:border-blue-400/70 hover:text-blue-700 rounded-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => onDelete(nozzle.id)}
            variant="outline"
            className="bg-red-50/80 backdrop-blur-sm border-red-300/60 text-red-600 hover:bg-red-100/80 hover:border-red-400/70 hover:text-red-700 rounded-xl transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
