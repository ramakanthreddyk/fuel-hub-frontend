
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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FuelNozzleCardProps {
  nozzle: {
    id: string;
    nozzleNumber: number;
    fuelType: 'petrol' | 'diesel' | 'premium';
    status: 'active' | 'maintenance' | 'inactive';
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
          icon: Droplets,
          label: 'Petrol'
        };
      case 'diesel':
        return {
          gradient: 'from-orange-50 via-amber-50 to-yellow-50',
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: Zap,
          label: 'Diesel'
        };
      case 'premium':
        return {
          gradient: 'from-purple-50 via-indigo-50 to-blue-50',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Droplets,
          label: 'Premium'
        };
      default:
        return {
          gradient: 'from-gray-50 via-slate-50 to-zinc-50',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Droplets,
          label: 'Unknown'
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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm">
              <FuelIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {fuelConfig.label} Dispenser
              </p>
            </div>
          </div>
          
          <Badge className={cn("text-xs font-semibold", statusConfig.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FuelIcon className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-600">Type</span>
            </div>
            <div className="text-sm font-bold text-slate-800 capitalize">
              {nozzle.fuelType}
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-slate-600">Status</span>
            </div>
            <div className="text-sm font-bold text-slate-800 capitalize">
              {nozzle.status}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs"
            size="sm"
            onClick={() => onRecordReading(nozzle.id)}
          >
            <Gauge className="w-3 h-3 mr-1" />
            Record Reading
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
              onClick={() => onEdit(nozzle.id)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white hover:text-red-600 text-xs"
              onClick={() => onDelete(nozzle.id)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
