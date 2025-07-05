
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Wrench,
  Trash2,
  MoreVertical,
  Droplets,
  Zap,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FuelPumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: 'active' | 'maintenance' | 'inactive';
    nozzleCount?: number;
  };
  onViewNozzles: (pumpId: string) => void;
  onDelete: (pumpId: string) => void;
  needsAttention?: boolean;
}

export function FuelPumpCard({ pump, onViewNozzles, onDelete, needsAttention = false }: FuelPumpCardProps) {
  const getStatusConfig = () => {
    switch (pump.status) {
      case 'active':
        return {
          color: 'bg-emerald-400',
          shadowColor: 'shadow-emerald-400/30',
          bgGradient: 'from-emerald-50 to-green-100',
          textColor: 'text-emerald-800',
          icon: CheckCircle,
          label: 'ACTIVE'
        };
      case 'maintenance':
        return {
          color: 'bg-amber-400',
          shadowColor: 'shadow-amber-400/30',
          bgGradient: 'from-amber-50 to-orange-100',
          textColor: 'text-amber-800',
          icon: Wrench,
          label: 'MAINTENANCE'
        };
      case 'inactive':
        return {
          color: 'bg-slate-400',
          shadowColor: 'shadow-slate-400/30',
          bgGradient: 'from-slate-50 to-gray-100',
          textColor: 'text-slate-800',
          icon: AlertTriangle,
          label: 'OFFLINE'
        };
      default:
        return {
          color: 'bg-slate-400',
          shadowColor: 'shadow-slate-400/30',
          bgGradient: 'from-slate-50 to-gray-100',
          textColor: 'text-slate-800',
          icon: AlertTriangle,
          label: 'UNKNOWN'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "relative group transition-all duration-300 hover:scale-[1.02]",
      needsAttention && "animate-pulse"
    )}>
      {/* Fuel Pump Dispenser Shape */}
      <div className={cn(
        "relative bg-gradient-to-b",
        statusConfig.bgGradient,
        "rounded-3xl p-8 shadow-2xl border-4 border-white",
        statusConfig.shadowColor,
        "min-h-[420px] max-w-[280px] mx-auto"
      )}>
        
        {/* Top Display Panel */}
        <div className="bg-slate-900 rounded-xl p-4 mb-6 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="text-green-400 font-mono text-xs tracking-wider">FUELSYNC</div>
            <div className={cn(
              "w-3 h-3 rounded-full",
              statusConfig.color,
              pump.status === 'active' && "animate-pulse shadow-lg"
            )} />
          </div>
          
          <div className="text-white font-mono text-xl font-bold mb-1">
            {pump.name.toUpperCase()}
          </div>
          
          <div className="text-green-400 font-mono text-sm">
            #{pump.serialNumber || 'N/A'}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <Badge className={cn(
            "px-4 py-2 text-white font-bold text-sm shadow-lg",
            statusConfig.color,
            "flex items-center gap-2"
          )}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Nozzle Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-slate-800">
                {pump.nozzleCount || 0}
              </span>
            </div>
            <div className="text-slate-600 font-medium">
              {pump.nozzleCount === 1 ? 'Nozzle' : 'Nozzles'}
            </div>
          </div>
        </div>

        {needsAttention && (
          <div className="flex items-center justify-center gap-2 bg-orange-100 border-2 border-orange-300 rounded-lg p-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-orange-800 text-sm">NEEDS ATTENTION</span>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
          <Button 
            onClick={() => onViewNozzles(pump.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
          >
            <Eye className="w-5 h-5 mr-3" />
            VIEW NOZZLES
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-white/90 border-2 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-600" />
              Settings
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-3 bg-white/90 border-2 hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-2 shadow-xl">
                <DropdownMenuItem onClick={() => onDelete(pump.id)} className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Pump
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Fuel Hose Visual Elements */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-4 bg-slate-700 rounded-b-lg shadow-lg" />
        </div>
        
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-16 bg-slate-600 rounded-r-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
}
