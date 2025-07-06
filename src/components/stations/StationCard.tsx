
/**
 * @file components/stations/StationCard.tsx
 * @description Enhanced station card with white theme and improved readability
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
        bg: 'from-emerald-50 via-teal-50 to-green-50',
        border: 'border-emerald-200',
        glow: 'hover:ring-2 hover:ring-emerald-300/50 hover:shadow-emerald-200/40'
      },
      {
        name: 'diesel', 
        bg: 'from-amber-50 via-orange-50 to-yellow-50',
        border: 'border-amber-200',
        glow: 'hover:ring-2 hover:ring-amber-300/50 hover:shadow-amber-200/40'
      },
      {
        name: 'premium',
        bg: 'from-purple-50 via-indigo-50 to-violet-50', 
        border: 'border-purple-200',
        glow: 'hover:ring-2 hover:ring-purple-300/50 hover:shadow-purple-200/40'
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
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-100/80 border-emerald-300/60 ring-emerald-300/30',
          textColor: 'text-emerald-700'
        };
      case 'maintenance':
        return {
          icon: Clock,
          label: 'Maintenance',
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-100/80 border-amber-300/60 ring-amber-300/30',
          textColor: 'text-amber-700'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100/80 border-red-300/60 ring-red-300/30',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100/80 border-gray-300/60 ring-gray-300/30',
          textColor: 'text-gray-700'
        };
    }
  };

  const cardVariant = getCardVariant(station.id);
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
      `bg-gradient-to-br ${cardVariant.bg}`,
      cardVariant.border,
      cardVariant.glow,
      "shadow-xl hover:shadow-2xl"
    )}>
      {/* Fuel type indicator badge */}
      <div className="absolute top-4 left-4 flex gap-1">
        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg" title="Petrol Available" />
        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg" title="Diesel Available" />
        <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg" title="Premium Available" />
      </div>

      {/* Floating Station Icon */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-300/30">
        <Building2 className="h-7 w-7 text-blue-600 drop-shadow-sm" />
        {station.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative p-8 space-y-6 pt-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between pr-16">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-2xl text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                {station.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
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
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/80 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Station Building */}
                <div className="w-32 h-20 bg-gradient-to-b from-gray-300 to-gray-500 rounded-2xl border border-gray-400/60 shadow-2xl relative overflow-hidden">
                  {/* Station Sign */}
                  <div className="absolute top-2 left-2 right-2 h-6 bg-gray-800 rounded border border-blue-400/60 flex items-center justify-center">
                    <div className={cn(
                      "text-xs font-bold truncate px-2",
                      station.status === 'active' ? "text-blue-400" : 
                      station.status === 'maintenance' ? "text-amber-400" : "text-red-400"
                    )}>
                      {station.name.slice(0, 12)}
                    </div>
                  </div>
                  
                  {/* Canopy Structure */}
                  <div className="absolute -top-2 -left-4 -right-4 h-3 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-t-2xl shadow-lg border border-gray-300/60"></div>
                  
                  {/* Fuel Islands */}
                  <div className="absolute bottom-2 left-4 right-4 flex justify-between">
                    {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => (
                      <div key={i} className="w-3 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-sm border border-gray-400/60"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
                <Fuel className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Pumps</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {station.pumpCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Active dispensers
            </div>
          </div>
          
          <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/20 ring-1 ring-amber-400/30">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-amber-700">Rating</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {station.rating?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Service quality
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onView(station.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 ring-2 ring-blue-400/20 hover:ring-blue-300/40"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="bg-red-50/80 backdrop-blur-sm border-red-300/60 text-red-600 hover:bg-red-100/80 hover:border-red-400/70 hover:text-red-700 rounded-xl transition-all duration-300 ring-1 ring-red-300/20 hover:ring-red-400/40"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
