/**
 * @file components/nozzles/FuelNozzleCard.tsx
 * @description Enhanced fuel nozzle card with improved visibility and white theme
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Eye, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Settings2,
  Fuel,
  Gauge,
  FileText,
  MapPin
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
    stationName?: string;
    pumpId?: string;
    stationId?: string;
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
          bg: 'from-emerald-50 to-green-50',
          border: 'border-emerald-200',
          accent: 'bg-emerald-500',
          icon: '⛽',
          color: 'text-emerald-700',
          lightBg: 'bg-emerald-50'
        };
      case 'diesel':
        return {
          bg: 'from-amber-50 to-orange-50',
          border: 'border-amber-200',
          accent: 'bg-amber-500',
          icon: '🛢️',
          color: 'text-amber-700',
          lightBg: 'bg-amber-50'
        };
      case 'premium':
        return {
          bg: 'from-purple-50 to-violet-50',
          border: 'border-purple-200',
          accent: 'bg-purple-500',
          icon: '✨',
          color: 'text-purple-700',
          lightBg: 'bg-purple-50'
        };
    }
  };

  const getStatusConfig = () => {
    switch (nozzle.status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
          border: 'border-emerald-300'
        };
      case 'maintenance':
        return {
          icon: Settings2,
          label: 'Maintenance',
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          border: 'border-amber-300'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-300'
        };
    }
  };

  const fuelConfig = getFuelTypeConfig();
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
      fuelConfig.border
    )}>
      {/* Header with fuel type indicator */}
      <div className={cn("h-2 w-full", fuelConfig.accent)} />
      
      <div className="p-6 space-y-4">
        {/* Top row with nozzle info and status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm",
              fuelConfig.lightBg,
              fuelConfig.color
            )}>
              {fuelConfig.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {nozzle.fuelType} Dispenser
              </p>
            </div>
          </div>
          
          <div className={cn(
            "inline-flex px-3 py-1 rounded-full border items-center gap-2 text-sm font-medium",
            statusConfig.bg,
            statusConfig.border,
            statusConfig.color
          )}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </div>
        </div>

        {/* Location info */}
        {(nozzle.stationName || nozzle.pumpName) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <div className="flex flex-col">
              {nozzle.stationName && (
                <span className="font-medium">{nozzle.stationName}</span>
              )}
              {nozzle.pumpName && (
                <span className="text-gray-500">{nozzle.pumpName}</span>
              )}
            </div>
          </div>
        )}

        {/* 3D Nozzle Visualization */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 border">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Nozzle Handle */}
              <div className="w-16 h-20 rounded-xl shadow-lg border bg-gradient-to-b from-gray-300 to-gray-500 relative overflow-hidden">
                {/* Display Screen */}
                <div className="absolute top-2 left-1 right-1 h-6 bg-gray-800 rounded-md border border-blue-400/60 flex items-center justify-center">
                  <div className={cn(
                    "text-xs font-mono font-bold",
                    nozzle.status === 'active' ? "text-blue-400 animate-pulse" : 
                    nozzle.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                  )}>
                    #{nozzle.nozzleNumber}
                  </div>
                </div>
                
                {/* Status Light */}
                <div className={cn(
                  "absolute top-10 right-1 w-2 h-2 rounded-full border border-white/50",
                  nozzle.status === 'active' ? "bg-emerald-500 animate-pulse" : 
                  nozzle.status === 'maintenance' ? "bg-amber-500" : "bg-red-500"
                )} />
                
                {/* Nozzle Hose */}
                <div className="absolute right-0 top-12 w-4 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-r-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Last Reading</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {nozzle.lastReading ? `${nozzle.lastReading.toLocaleString()}L` : 'N/A'}
            </div>
          </div>
          
          <div className={cn("rounded-xl p-3 border", fuelConfig.lightBg, fuelConfig.border)}>
            <div className="flex items-center gap-2 mb-1">
              <Fuel className={cn("h-4 w-4", fuelConfig.color)} />
              <span className={cn("text-xs font-medium", fuelConfig.color)}>Fuel Type</span>
            </div>
            <div className="text-lg font-bold text-gray-900 capitalize">
              {nozzle.fuelType}
            </div>
          </div>
        </div>

        {/* Action Buttons - Improved layout for better visibility */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onRecordReading(nozzle.id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 text-sm px-3 py-2"
          >
            <FileText className="w-4 h-4 mr-1" />
            Record
          </Button>
          <Button 
            onClick={() => onEdit(nozzle.id)}
            variant="outline"
            size="sm"
            className="bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100 hover:border-blue-400 rounded-xl px-3"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => onDelete(nozzle.id)}
            variant="outline"
            size="sm"
            className="bg-red-50 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 rounded-xl px-3"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
