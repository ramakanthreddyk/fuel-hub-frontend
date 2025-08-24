
/**
 * @file components/stations/ModernStationCard.tsx
 * @description Modern station card with realistic design and better space utilization
 * Updated: 2025-07-27
 */
import type { Station, Pump } from '@/api/api-contract';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Fuel, Trash2, Eye, Zap } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { formatCurrencyMobile, formatCountMobile } from '@/utils/mobileFormatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernStationCardProps {
  station: Station;
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
  fuelPrices?: Array<{ fuelType: string; price: number }>;
  pumps?: Pump[];
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
}: Readonly<ModernStationCardProps>) {
  const isMobile = useIsMobile();
  
  const getStatusConfig = () => {
    switch (station.status) {
      case 'active':
        return {
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          accentColor: 'bg-green-500',
          textColor: 'text-blue-900'
        };
      case 'maintenance':
        return {
          bgColor: 'bg-gradient-to-br from-orange-50 to-yellow-100',
          badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          accentColor: 'bg-yellow-500',
          textColor: 'text-orange-900'
        };
      case 'inactive':
        return {
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-100',
          badgeColor: 'bg-red-100 text-red-800 border-red-200',
          accentColor: 'bg-red-500',
          textColor: 'text-gray-900'
        };
      default:
        return {
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          accentColor: 'bg-green-500',
          textColor: 'text-blue-900'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="group overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-[1.02] hover:-translate-y-1">
      {/* Header Section */}
      <div className={`${statusConfig.bgColor} p-6 pb-4 relative`}>

        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
              <span className="text-lg">⛽</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-xl mb-1 truncate ${statusConfig.textColor}`} title={station.address}>
                {station.address}
              </h3>
              <div className="flex items-center gap-1 text-blue-700/80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate" title={station.contactNumber}>
                  {station.contactNumber}
                </span>
              </div>
            </div>
          </div>
          
          <Badge className={`${statusConfig.badgeColor} font-medium text-sm px-3 py-1 border-0`}>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <TrendingUp className="h-3 w-3 text-blue-600 mx-auto mb-1" />
            <div className="text-sm sm:text-lg font-bold text-blue-900">
              {isMobile ? formatCountMobile(todayTransactions) : formatNumber(todayTransactions)}
            </div>
            <div className="text-[10px] text-blue-700 font-medium">Sales Today</div>
          </div>

          <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <Fuel className="h-3 w-3 text-purple-600 mx-auto mb-1" />
            <div className="text-sm sm:text-lg font-bold text-purple-900">{activePumps}/{(pumps?.length || station.pumps?.length || 0)}</div>
            <div className="text-[10px] text-purple-700 font-medium">Active Pumps</div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Today's Revenue</div>
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </div>
          <div className="text-xl sm:text-3xl font-bold text-gray-900">
            {todaySales > 0 ? (isMobile ? formatCurrencyMobile(todaySales) : formatCurrency(todaySales, { maximumFractionDigits: 0 })) : '₹0'}
          </div>
        </div>

        {/* Realistic Fuel Station Visual */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
          <div className="flex justify-center items-center mb-4">
            {/* Modern Station Canopy */}
            <div className="relative">
              <div className="w-40 h-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-lg shadow-lg"></div>
              
              {/* Support Pillars */}
              <div className="absolute -bottom-12 left-2 w-2 h-12 bg-gray-400 rounded-b-lg shadow-md"></div>
              <div className="absolute -bottom-12 right-2 w-2 h-12 bg-gray-400 rounded-b-lg shadow-md"></div>
              <div className="text-sm sm:text-lg font-bold text-purple-900">{activePumps}/{pumps?.length ?? station.pumps?.length ?? 0}</div>
              {/* LED Strip */}
              <div className="absolute bottom-1 left-4 right-4 flex justify-center space-x-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 500}ms` }}></div>
                ))}
              </div>
              
              {/* Fuel Dispensers */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {Array.from({ length: Math.min(pumps?.length ?? station.pumps?.length ?? 0, 4) }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Dispenser Body */}
                    <div className="w-6 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-lg relative">
                      {/* Digital Display */}
                      <div className="absolute top-1 left-0.5 right-0.5 h-2 bg-green-400 rounded-sm opacity-80"></div>
                      
                      {/* Fuel Indicators */}
                      <div className="absolute top-4 left-1 right-1 flex justify-between">
                        <div className="w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                      
                      {/* Nozzle Holster */}
                      <div className="absolute right-0 top-5 w-1.5 h-3 bg-gray-400 rounded-l-md shadow-sm">
                        <div className="absolute top-0.5 -right-0.5 w-0.5 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                      
                      {/* Fuel Hose */}
                      <div className="absolute -right-1 top-6 w-0.5 h-4 bg-gray-400 rounded-full animate-sway"></div>
                      
                      {/* Price Display */}
                      <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1.5 bg-gray-900 rounded-sm">
                        <div className="text-[3px] text-green-400 font-mono text-center leading-1">
                          ₹{(85 + Math.random() * 15).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Base Platform */}
                    <div className="w-7 h-2 bg-gray-500 rounded-b-lg shadow-md"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-2">
          <Button
            onClick={() => onView(station.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Eye className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">View Station Details</span>
            <span className="sm:hidden">View Details</span>
          </Button>

          <Button
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="px-3 sm:px-4 py-2 sm:py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </CardContent>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
