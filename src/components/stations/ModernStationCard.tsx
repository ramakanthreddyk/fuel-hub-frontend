
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, TrendingUp, Fuel, Activity, Trash2, Eye } from 'lucide-react';
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
          bgColor: 'bg-green-500',
          badgeColor: 'bg-green-100 text-green-800',
        };
      case 'maintenance':
        return {
          bgColor: 'bg-yellow-500',
          badgeColor: 'bg-yellow-100 text-yellow-800',
        };
      case 'inactive':
        return {
          bgColor: 'bg-red-500',
          badgeColor: 'bg-red-100 text-red-800',
        };
      default:
        return {
          bgColor: 'bg-green-500',
          badgeColor: 'bg-green-100 text-green-800',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
      {/* Header Section with Gradient Background */}
      <div className={`${statusConfig.bgColor} p-4 text-white relative`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base mb-1 truncate" title={station.name}>
                {station.name}
              </h3>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs truncate" title={station.address}>
                  {station.address}
                </span>
              </div>
            </div>
          </div>
          
          <Badge className={`${statusConfig.badgeColor} font-medium text-xs px-2 py-1 border-0 hidden sm:flex`}>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Stats Grid - Three Columns */}
        <div className="grid grid-cols-3 gap-3">
          {/* Sales Today */}
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">{formatNumber(todayTransactions)}</div>
            <div className="text-xs text-blue-600 font-medium">Sales Today</div>
          </div>
          
          {/* Active Pumps */}
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Fuel className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">{activePumps}/{station.pumpCount}</div>
            <div className="text-xs text-purple-600 font-medium">Active Pumps</div>
          </div>
          
          {/* Status Circle */}
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <div className={`w-3 h-3 rounded-full ${station.status === 'active' ? 'bg-green-500' : station.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="text-lg font-bold text-green-600">●</div>
            <div className="text-xs text-green-600 font-medium">Status</div>
          </div>
        </div>

        {/* Today's Revenue Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Today's Revenue</div>
            <Activity className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {todaySales > 0 ? formatCurrency(todaySales, { maximumFractionDigits: 0 }) : '₹0'}
          </div>
        </div>

        {/* Enhanced Fuel Dispensers Visual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-center items-center mb-3">
            {/* Station Canopy */}
            <div className="relative">
              <div className="w-32 h-3 bg-green-500 rounded-lg shadow-sm"></div>
              
              {/* Fuel Dispensers - Better Visualization */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: Math.min(station.pumpCount, 6) }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Dispenser Unit */}
                    <div className="w-4 h-8 bg-gray-700 rounded-t-md shadow-sm relative">
                      {/* Display Screen */}
                      <div className="absolute top-1 left-0.5 right-0.5 h-1.5 bg-blue-400 rounded-sm"></div>
                      {/* Fuel Indicators */}
                      <div className="absolute top-3 left-1 right-1 flex justify-between">
                        <div className="w-0.5 h-0.5 bg-green-400 rounded-full"></div>
                        <div className="w-0.5 h-0.5 bg-red-400 rounded-full"></div>
                      </div>
                      {/* Nozzle */}
                      <div className="absolute -right-1 top-2 w-1 h-1 bg-gray-500 rounded-full"></div>
                    </div>
                    {/* Base */}
                    <div className="w-5 h-2 bg-gray-600 rounded-b-md"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onView(station.id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          
          <Button
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
