
/**
 * @file components/pumps/FuelPumpCard.tsx
 * @description Redesigned fuel pump card component with consistent styling
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColorfulCard, CardHeader, CardContent } from '@/components/ui/colorful-card';
import { 
  Fuel, 
  Hash, 
  Activity, 
  Eye, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FuelPumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: 'active' | 'maintenance' | 'inactive';
    nozzleCount: number;
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
          gradient: 'from-green-50 via-emerald-50 to-teal-50',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          label: 'Active'
        };
      case 'maintenance':
        return {
          gradient: 'from-yellow-50 via-orange-50 to-amber-50',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock,
          label: 'Maintenance'
        };
      case 'inactive':
        return {
          gradient: 'from-red-50 via-pink-50 to-rose-50',
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: AlertTriangle,
          label: 'Inactive'
        };
      default:
        return {
          gradient: 'from-gray-50 via-slate-50 to-zinc-50',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertTriangle,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <ColorfulCard 
      gradient={statusConfig.gradient}
      className={cn(
        "relative transform hover:scale-[1.02] transition-all duration-200",
        needsAttention && "ring-2 ring-yellow-400 ring-opacity-50"
      )}
    >
      {needsAttention && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm">
              <Fuel className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{pump.name}</h3>
              {pump.serialNumber && (
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {pump.serialNumber}
                </p>
              )}
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
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-600">Nozzles</span>
            </div>
            <div className="text-lg font-bold text-slate-800">
              {pump.nozzleCount}
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-slate-600">Status</span>
            </div>
            <div className="text-sm font-bold text-slate-800 capitalize">
              {pump.status}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
            onClick={() => onViewNozzles(pump.id)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Nozzles
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white hover:text-red-600 text-xs"
            onClick={() => onDelete(pump.id)}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
