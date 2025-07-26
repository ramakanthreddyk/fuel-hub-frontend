
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, TrendingUp, Fuel, Activity, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface ModernStationCardProps {
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
  fuelPrices?: any[];
  pumps?: any[];
  todaySales?: number;
  todayTransactions?: number;
  activePumps?: number;
}

export function ModernStationCard({ 
  station, 
  onView, 
  onDelete,
  fuelPrices = [],
  pumps = [],
  todaySales = 0,
  todayTransactions = 0,
  activePumps = 0
}: ModernStationCardProps) {
  
  const getStatusConfig = () => {
    switch (station.status) {
      case 'active':
        return {
          bgColor: 'bg-emerald-500',
          textColor: 'text-white',
          badgeColor: 'bg-white/20 text-white border-white/30',
        };
      case 'maintenance':
        return {
          bgColor: 'bg-amber-500',
          textColor: 'text-white',
          badgeColor: 'bg-white/20 text-white border-white/30',
        };
      case 'inactive':
        return {
          bgColor: 'bg-slate-500',
          textColor: 'text-white',
          badgeColor: 'bg-white/20 text-white border-white/30',
        };
      default:
        return {
          bgColor: 'bg-emerald-500',
          textColor: 'text-white',
          badgeColor: 'bg-white/20 text-white border-white/30',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-200 rounded-2xl">
      {/* Header Section */}
      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} p-6 relative`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg mb-1 truncate">{station.name}</h3>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{station.address}</span>
              </div>
            </div>
          </div>
          
          <Badge className={`${statusConfig.badgeColor} font-medium text-xs px-3 py-1 border hidden sm:flex`}>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 pt-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Sales Today */}
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{formatNumber(todayTransactions)}</div>
            <div className="text-xs text-blue-600 font-medium">Sales Today</div>
          </div>
          
          {/* Active Pumps */}
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Fuel className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{activePumps}/{station.pumpCount}</div>
            <div className="text-xs text-purple-600 font-medium">Active Pumps</div>
          </div>
          
          {/* Status Indicator */}
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{station.status === 'active' ? '●' : '○'}</div>
            <div className="text-xs text-green-600 font-medium">Status</div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-600 mb-1">Today's Revenue</div>
              <div className="text-2xl font-bold text-gray-900">
                {todaySales > 0 ? formatCurrency(todaySales, { maximumFractionDigits: 0 }) : '₹0'}
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Fuel Dispensers Visual */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-center items-center space-x-3 mb-3">
            {/* Canopy */}
            <div className="relative">
              <div className="w-24 h-4 bg-emerald-500 rounded-lg shadow-sm"></div>
              {/* Fuel Dispensers */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: Math.min(station.pumpCount, 6) }, (_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-6 bg-gray-700 rounded-sm shadow-sm relative"
                  >
                    <div className="absolute top-1 left-0 right-0 h-1 bg-emerald-400 rounded-sm"></div>
                    <div className="absolute bottom-1 left-0 right-0 h-1 bg-blue-400 rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 font-medium mt-2">
            {station.pumpCount} Fuel Dispensers
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onView(station.id)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Activity className="mr-2 h-4 w-4" />
            Manage Station
          </Button>
          
          <Button
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
