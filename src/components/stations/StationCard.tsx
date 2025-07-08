
/**
 * @file components/stations/StationCard.tsx
 * @description Enhanced station card with improved layout and fuel price display
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Eye, 
  Trash2, 
  Fuel,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';

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
  const { data: fuelPrices = [], isLoading: pricesLoading } = useFuelPrices(station.id);

  const getStatusConfig = () => {
    switch (station.status) {
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
          icon: Clock,
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
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100/80 border-gray-300/60',
          textColor: 'text-gray-700'
        };
    }
  };

  // Process fuel prices to get the latest price for each fuel type
  const processedPrices = React.useMemo(() => {
    if (!Array.isArray(fuelPrices) || fuelPrices.length === 0) return {};
    
    const pricesByType: Record<string, any> = {};
    
    fuelPrices.forEach(price => {
      if (price && price.fuelType && price.price !== undefined) {
        if (!pricesByType[price.fuelType] || 
            new Date(price.validFrom || 0) > new Date(pricesByType[price.fuelType].validFrom || 0)) {
          pricesByType[price.fuelType] = price;
        }
      }
    });
    
    return pricesByType;
  }, [fuelPrices]);

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const hasPrices = Object.keys(processedPrices).length > 0;

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case 'diesel': return { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' };
      case 'premium': return { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{station.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{station.address}</span>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "inline-flex px-3 py-1 rounded-full border items-center gap-2 text-sm font-medium",
            statusConfig.bgColor,
            statusConfig.textColor
          )}>
            <StatusIcon className={cn("w-3 h-3", statusConfig.iconColor)} />
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Station Visual */}
      <div className="px-6 pb-4">
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex justify-center">
            <div className="relative">
              {/* Station Building */}
              <div className="w-28 h-20 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-lg relative">
                {/* Station Sign */}
                <div className="absolute top-1 left-1 right-1 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <div className="text-xs font-bold text-blue-400 truncate px-1">
                    {station.name.slice(0, 10)}
                  </div>
                </div>
                
                {/* Canopy */}
                <div className="absolute -top-1 -left-3 -right-3 h-3 bg-gray-400 rounded-t-lg shadow-md"></div>
                
                {/* Fuel Islands */}
                <div className="absolute bottom-2 left-3 right-3 flex justify-between">
                  {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => (
                    <div key={i} className="w-2 h-5 bg-gray-600 rounded shadow-sm"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Sections */}
      <div className="px-6 space-y-4">
        {/* Fuel Dispensers */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Fuel className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Fuel Dispensers</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{station.pumpCount}</div>
            <div className="text-xs text-gray-600">Active dispensers</div>
          </div>
        </div>
        
        {/* Fuel Prices */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Current Fuel Prices</span>
          </div>
          
          {pricesLoading ? (
            <div className="text-sm text-gray-600">Loading prices...</div>
          ) : hasPrices ? (
            <div className="space-y-2">
              {Object.entries(processedPrices).map(([fuelType, price]) => {
                const colors = getFuelTypeColor(fuelType);
                return (
                  <div key={fuelType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", colors.dot)}></div>
                      <span className="text-sm capitalize font-medium">{fuelType}</span>
                    </div>
                    <div className="font-bold text-gray-900">₹{parseFloat(price.price || 0).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Prices not set</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-4">
        <div className="flex gap-3">
          <Button 
            onClick={() => onView(station.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
