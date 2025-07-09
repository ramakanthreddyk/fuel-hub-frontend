
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
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
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 mb-4 border border-blue-100">
          <div className="flex justify-center">
            <div className="relative">
              {/* Station Building */}
              <div className="w-32 h-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-xl relative overflow-hidden">
                {/* Station Sign */}
                <div className="absolute top-2 left-2 right-2 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-md">
                  <div className="text-xs font-bold text-white truncate px-2">
                    {station.name.slice(0, 12)}
                  </div>
                </div>
                
                {/* Canopy */}
                <div className="absolute -top-2 -left-4 -right-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-xl shadow-lg"></div>
                
                {/* Building Details */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-1 bg-blue-300 rounded mb-1"></div>
                  <div className="h-1 bg-blue-300 rounded"></div>
                </div>
              </div>

              {/* Fuel Dispensers */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3">
                {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => (
                  <div key={i} className="relative group">
                    <div className="w-4 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t shadow-lg border-2 border-white">
                      {/* Pump Display */}
                      <div className="absolute top-1 left-0 right-0 h-2 bg-gray-900 rounded-sm"></div>
                      {/* Nozzle */}
                      <div className="absolute -right-1 top-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      {/* Hose */}
                      <div className="absolute -right-1 top-4 w-1 h-3 bg-gray-700 rounded"></div>
                    </div>
                    {/* Base Platform */}
                    <div className="w-6 h-2 bg-gray-400 rounded-b -mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Sections */}
      <div className="px-6 space-y-4">
        {/* Fuel Dispensers */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-full bg-blue-500">
              <Fuel className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-800">Fuel Dispensers</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-900">{station.pumpCount}</div>
            <div className="text-xs text-blue-700 font-medium">Active dispensers</div>
          </div>
        </div>
        
        {/* Fuel Prices */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-full bg-orange-500">
              <Star className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-orange-800">Current Fuel Prices</span>
          </div>
          
          {pricesLoading ? (
            <div className="text-sm text-orange-600">Loading prices...</div>
          ) : hasPrices ? (
            <div className="space-y-2">
              {Object.entries(processedPrices).map(([fuelType, price]) => {
                const colors = getFuelTypeColor(fuelType);
                return (
                  <div key={fuelType} className="flex items-center justify-between bg-white/60 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", colors.dot)}></div>
                      <span className="text-sm capitalize font-medium text-gray-800">{fuelType}</span>
                    </div>
                    <div className="font-bold text-gray-900">₹{parseFloat(price.price || 0).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-600 bg-white/60 rounded-lg p-2">
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
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl hover:border-red-400 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
