
/**
 * @file components/nozzles/NozzleCard.tsx
 * @description Enhanced nozzle card with realistic fuel station design
 * Updated for immersive fuel station UI – 2025-07-04
 */
import { Button } from '@/components/ui/button';
import { Plus, Settings, Activity, AlertTriangle } from 'lucide-react';
import { ColorfulCard, CardContent, CardHeader } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { FuelBadge } from '@/components/ui/fuel-badge';

interface NozzleCardProps {
  nozzle: {
    id: string;
  name: string;
    fuelType: string;
    status: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRecordReading?: (id: string) => void;
}

export function NozzleCard({ nozzle, onEdit, onDelete, onRecordReading }: NozzleCardProps) {
  const getGradientByFuelType = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return 'from-blue-50 via-cyan-50 to-sky-50 border-blue-200';
      case 'diesel':
        return 'from-green-50 via-emerald-50 to-teal-50 border-green-200';
      case 'premium':
        return 'from-purple-50 via-indigo-50 to-violet-50 border-purple-200';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
    }
  };

  const getNozzleEmoji = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return '⛽';
      case 'diesel': return '🛢️';
      case 'premium': return '✨';
      default: return '⛽';
    }
  };

  const isActive = nozzle.status.toLowerCase() === 'active';

  return (
    <ColorfulCard 
      gradient={getGradientByFuelType(nozzle.fuelType)}
      className="border group hover:shadow-2xl"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative">
                <div className="p-3 bg-slate-800 rounded-xl shadow-lg">
                  <span className="text-2xl">{getNozzleEmoji(nozzle.fuelType)}</span>
                </div>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                  Nozzle {nozzle.name}
                </h3>
                <div className="mt-1">
                  <FuelBadge fuelType={nozzle.fuelType} size="sm" />
                </div>
              </div>
            </div>
            <StatusBadge status={nozzle.status} size="sm" />
          </div>

          {/* Status Info */}
          <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm border border-white/30">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Current Status</p>
                <p className="font-medium text-gray-900 capitalize">{nozzle.status}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Primary Action */}
          {isActive ? (
            <Button 
              onClick={() => onRecordReading?.(nozzle.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Record Reading
            </Button>
          ) : (
            <Button 
              disabled 
              className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Not Available
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                onClick={() => onEdit(nozzle.id)}
                size="sm" 
                variant="outline"
                className="flex-1 bg-white/60 backdrop-blur-sm border border-gray-300 hover:bg-white/80"
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={() => onDelete(nozzle.id)}
                size="sm" 
                variant="outline"
                className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
