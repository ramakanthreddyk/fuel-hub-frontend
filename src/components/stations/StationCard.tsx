
/**
 * @file components/stations/StationCard.tsx
 * @description Enhanced station card with improved theming and fuel type indicators
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Hash, 
  Eye, 
  Trash2, 
  Fuel,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Droplets,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    status: 'active' | 'maintenance' | 'inactive';
    pumpCount: number;
    rating?: number;
  };
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
}

export function StationCard({ station, onView, onDelete }: StationCardProps) {
  // Get card variant based on station ID for visual variety
  const getCardVariant = (id: string) => {
    const variants = [
      {
        name: 'petrol',
        bg: 'from-emerald-800/90 via-teal-800/80 to-green-900/90',
        border: 'border-emerald-500/40',
        glow: 'hover:ring-2 hover:ring-emerald-400/50 hover:shadow-emerald-400/20'
      },
      {
        name: 'diesel', 
        bg: 'from-amber-800/90 via-orange-800/80 to-yellow-900/90',
        border: 'border-amber-500/40',
        glow: 'hover:ring-2 hover:ring-amber-400/50 hover:shadow-amber-400/20'
      },
      {
        name: 'premium',
        bg: 'from-purple-800/90 via-indigo-800/80 to-violet-900/90', 
        border: 'border-purple-500/40',
        glow: 'hover:ring-2 hover:ring-purple-400/50 hover:shadow-purple-400/20'
      }
    ];
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return variants[hash % variants.length];
  };

  const getStatusConfig = () => {
    switch (station.status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20 border-emerald-400/50 ring-emerald-400/30',
          textColor: 'text-emerald-300'
        };
      case 'maintenance':
        return {
          icon: Clock,
          label: 'Maintenance',
          iconColor: 'text-amber-400',
          bgColor: 'bg-amber-500/20 border-amber-400/50 ring-amber-400/30',
          textColor: 'text-amber-300'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/20 border-red-400/50 ring-red-400/30',
          textColor: 'text-red-300'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-400',
          bgColor: 'bg-gray-500/20 border-gray-400/50 ring-gray-400/30',
          textColor: 'text-gray-300'
        };
    }
  };

  const cardVariant = getCardVariant(station.id);
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]",
      `bg-gradient-to-br ${cardVariant.bg}`,
      cardVariant.border,
      cardVariant.glow,
      "shadow-2xl hover:shadow-3xl"
    )}>
      {/* Fuel type indicator badge */}
      <div className="absolute top-4 left-4 flex gap-1">
        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg" title="Petrol Available" />
        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg" title="Diesel Available" />
        <div className="w-3 h-3 rounded-full bg-purple-400 shadow-lg" title="Premium Available" />
      </div>

      {/* Floating Station Icon */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20">
        <Building2 className="h-7 w-7 text-white drop-shadow-lg" />
        {station.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative p-8 space-y-6 pt-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-white dark:text-white truncate group-hover:text-cyan-300 transition-colors">
                {station.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 text-sm">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{station.address}</span>
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

        {/* Station Visual */}
        <div className="relative">
          <div className="bg-gradient-to-b from-slate-700/60 to-slate-800/80 dark:from-slate-800/60 dark:to-slate-900/80 rounded-2xl p-6 border border-white/10 dark:border-white/10 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Station Building */}
                <div className="w-32 h-20 bg-gradient-to-b from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-2xl border border-slate-400/50 shadow-2xl relative overflow-hidden">
                  {/* Station Sign */}
                  <div className="absolute top-2 left-2 right-2 h-6 bg-black rounded border border-cyan-400/50 flex items-center justify-center">
                    <div className={cn(
                      "text-xs font-bold truncate px-2",
                      station.status === 'active' ? "text-cyan-400" : 
                      station.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                    )}>
                      {station.name.slice(0, 12)}
                    </div>
                  </div>
                  
                  {/* Canopy Structure */}
                  <div className="absolute -top-2 -left-4 -right-4 h-3 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded-t-2xl shadow-lg border border-slate-300/50"></div>
                  
                  {/* Fuel Islands */}
                  <div className="absolute bottom-2 left-4 right-4 flex justify-between">
                    {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => (
                      <div key={i} className="w-3 h-6 bg-gradient-to-b from-slate-500 to-slate-700 rounded shadow-sm border border-slate-400/50"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 dark:border-cyan-400/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 dark:bg-cyan-500/30 ring-1 ring-cyan-400/30">
                <Fuel className="h-5 w-5 text-cyan-400 dark:text-cyan-300" />
              </div>
              <span className="text-sm font-semibold text-cyan-200 dark:text-cyan-100">Pumps</span>
            </div>
            <div className="text-2xl font-bold text-white dark:text-white">
              {station.pumpCount}
            </div>
            <div className="text-xs text-slate-300 dark:text-slate-300 mt-1">
              Active dispensers
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/20 dark:border-yellow-400/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-yellow-500/20 dark:bg-yellow-500/30 ring-1 ring-yellow-400/30">
                <Star className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <span className="text-sm font-semibold text-yellow-200 dark:text-yellow-100">Rating</span>
            </div>
            <div className="text-2xl font-bold text-white dark:text-white">
              {station.rating?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-slate-300 dark:text-slate-300 mt-1">
              Service quality
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onView(station.id)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 ring-2 ring-cyan-400/20 hover:ring-cyan-300/40"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={() => onDelete(station.id)}
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
