
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Pencil, 
  Trash2, 
  MoreVertical,
  Flame,
  CheckCircle,
  AlertTriangle,
  Clock,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FuelNozzleCardProps {
  nozzle: {
    id: string;
    nozzleNumber: number;
    fuelType: 'petrol' | 'diesel' | 'premium';
    status?: 'active' | 'maintenance' | 'inactive';
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
          color: 'bg-red-500',
          lightColor: 'bg-red-100',
          borderColor: 'border-red-300',
          textColor: 'text-red-800',
          shadowColor: 'shadow-red-400/30',
          gradientFrom: 'from-red-400',
          gradientTo: 'to-rose-500',
          label: 'PETROL'
        };
      case 'diesel':
        return {
          color: 'bg-green-500',
          lightColor: 'bg-green-100',
          borderColor: 'border-green-300',
          textColor: 'text-green-800',
          shadowColor: 'shadow-green-400/30',
          gradientFrom: 'from-green-400',
          gradientTo: 'to-emerald-500',
          label: 'DIESEL'
        };
      case 'premium':
        return {
          color: 'bg-purple-500',
          lightColor: 'bg-purple-100',
          borderColor: 'border-purple-300',
          textColor: 'text-purple-800',
          shadowColor: 'shadow-purple-400/30',
          gradientFrom: 'from-purple-400',
          gradientTo: 'to-violet-500',
          label: 'PREMIUM'
        };
      default:
        return {
          color: 'bg-slate-500',
          lightColor: 'bg-slate-100',
          borderColor: 'border-slate-300',
          textColor: 'text-slate-800',
          shadowColor: 'shadow-slate-400/30',
          gradientFrom: 'from-slate-400',
          gradientTo: 'to-gray-500',
          label: 'UNKNOWN'
        };
    }
  };

  const getStatusConfig = () => {
    switch (nozzle.status) {
      case 'active':
        return { color: 'bg-emerald-400', icon: CheckCircle, label: 'ACTIVE' };
      case 'maintenance':
        return { color: 'bg-amber-400', icon: Clock, label: 'MAINTENANCE' };
      case 'inactive':
        return { color: 'bg-red-400', icon: AlertTriangle, label: 'OFFLINE' };
      default:
        return { color: 'bg-slate-400', icon: AlertTriangle, label: 'UNKNOWN' };
    }
  };

  const fuelConfig = getFuelTypeConfig();
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group transition-all duration-300 hover:scale-[1.02]">
      {/* Nozzle Dispenser Design */}
      <div className={cn(
        "relative bg-gradient-to-br from-white to-gray-50",
        "rounded-3xl p-6 shadow-2xl border-4 border-white",
        fuelConfig.shadowColor,
        "min-h-[380px] max-w-[240px] mx-auto overflow-hidden"
      )}>
        
        {/* Nozzle Handle */}
        <div className="flex flex-col items-center mb-6">
          <div className={cn(
            "relative w-16 h-24 rounded-2xl shadow-lg border-4 border-white",
            `bg-gradient-to-b ${fuelConfig.gradientFrom} ${fuelConfig.gradientTo}`
          )}>
            {/* Nozzle Number Badge */}
            <div className="absolute -top-3 -right-3 bg-slate-900 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
              {nozzle.nozzleNumber}
            </div>
            
            {/* Fuel Icon */}
            <div className="flex items-center justify-center h-full">
              <Droplets className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            
            {/* Nozzle Tip */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-slate-700 rounded-b-lg shadow-lg" />
          </div>
        </div>

        {/* Fuel Type Display */}
        <div className="text-center mb-6">
          <Badge className={cn(
            "text-white font-bold text-sm px-6 py-3 shadow-lg",
            fuelConfig.color
          )}>
            {fuelConfig.label}
          </Badge>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={cn("w-3 h-3 rounded-full", statusConfig.color)} />
          <span className="font-medium text-slate-700 text-sm">{statusConfig.label}</span>
        </div>

        {/* Control Panel */}
        <div className="space-y-3">
          <Button 
            onClick={() => onRecordReading(nozzle.id)}
            className={cn(
              "w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:shadow-xl",
              fuelConfig.color,
              "hover:opacity-90"
            )}
          >
            <Gauge className="w-5 h-5 mr-3" />
            RECORD READING
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(nozzle.id)}
              className="flex-1 bg-white border-2 hover:bg-gray-50 font-medium"
            >
              <Pencil className="w-4 h-4 mr-2 text-blue-600" />
              Edit
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-3 bg-white border-2 hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-2 shadow-xl">
                <DropdownMenuItem onClick={() => onDelete(nozzle.id)} className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Nozzle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Decorative Hose */}
        <div className="absolute -left-2 bottom-8">
          <div className="w-6 h-20 bg-slate-600 rounded-l-lg shadow-lg opacity-70" />
        </div>
      </div>
    </div>
  );
}
