
/**
 * @file components/nozzles/FuelNozzleCard.tsx
 * @description Redesigned fuel nozzle card component with consistent styling
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColorfulCard, CardHeader, CardContent } from '@/components/ui/colorful-card';
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
  Fuel
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
          gradient: 'from-green-50 via-emerald-50 to-teal-50',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: Fuel,
          label: 'Petrol',
          emoji: '⛽'
        };
      case 'diesel':
        return {
          gradient: 'from-orange-50 via-amber-50 to-yellow-50',
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: Droplets,
          label: 'Diesel',
          emoji: '🛢️'
        };
      case 'premium':
        return {
          gradient: 'from-purple-50 via-indigo-50 to-blue-50',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Zap,
          label: 'Premium',
          emoji: '✨'
        };
      default:
        return {
          gradient: 'from-gray-50 via-slate-50 to-zinc-50',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Droplets,
          label: 'Unknown',
          emoji: '⛽'
        };
    }
  };

  const getStatusConfig = () => {
    switch (nozzle.status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          label: 'Active'
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock,
          label: 'Maintenance'
        };
      case 'inactive':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: AlertTriangle,
          label: 'Inactive'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertTriangle,
          label: 'Unknown'
        };
    }
  };

  const fuelConfig = getFuelTypeConfig();
  const statusConfig = getStatusConfig();
  const FuelIcon = fuelConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <ColorfulCard 
      gradient={fuelConfig.gradient}
      className="transform hover:scale-[1.02] transition-all duration-200"
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm relative">
              <FuelIcon className="h-6 w-6 text-blue-600" />
              <span className="absolute -top-1 -right-1 text-lg">{fuelConfig.emoji}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-800 text-xl">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Hash className="h-3 w-3 flex-shrink-0" />
                  {fuelConfig.label} Dispenser
                </p>
                {nozzle.pumpName && (
                  <p className="text-xs text-slate-500 truncate">
                    @ {nozzle.pumpName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Badge className={cn("text-xs font-semibold flex-shrink-0", statusConfig.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FuelIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-semibold text-slate-600">Type</span>
            </div>
            <div className="text-lg font-bold text-slate-800 capitalize">
              {nozzle.fuelType}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Fuel grade
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gauge className="h-5 w-5 text-green-500" />
              <span className="text-sm font-semibold text-slate-600">Reading</span>
            </div>
            <div className="text-lg font-bold text-slate-800">
              {nozzle.lastReading ? `${nozzle.lastReading.toLocaleString()}L` : 'N/A'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Last recorded
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm py-3"
            onClick={() => onRecordReading(nozzle.id)}
          >
            <Gauge className="w-4 h-4 mr-2" />
            Record New Reading
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-sm font-medium"
              onClick={() => onEdit(nozzle.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white hover:text-red-600 text-sm font-medium"
              onClick={() => onDelete(nozzle.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
