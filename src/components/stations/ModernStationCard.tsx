
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Activity, Fuel, TrendingUp, Zap } from 'lucide-react';
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
          gradient: 'from-emerald-500 to-teal-600',
          bgGradient: 'from-emerald-50 to-teal-50',
          textColor: 'text-emerald-700',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          glowColor: 'shadow-emerald-200',
          icon: '●'
        };
      case 'maintenance':
        return {
          gradient: 'from-amber-500 to-orange-600',
          bgGradient: 'from-amber-50 to-orange-50',
          textColor: 'text-amber-700',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          glowColor: 'shadow-amber-200',
          icon: '◐'
        };
      case 'inactive':
        return {
          gradient: 'from-slate-500 to-gray-600',
          bgGradient: 'from-slate-50 to-gray-50',
          textColor: 'text-slate-700',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          glowColor: 'shadow-slate-200',
          icon: '○'
        };
      default:
        return {
          gradient: 'from-blue-500 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          glowColor: 'shadow-blue-200',
          icon: '●'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl transform hover:scale-[1.02] hover:-translate-y-1">
      {/* Modern Header with Gradient */}
      <div className={`relative bg-gradient-to-r ${statusConfig.gradient} p-6 text-white overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 truncate max-w-[200px]">{station.name}</h3>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate max-w-[180px]">{station.address}</span>
              </div>
            </div>
          </div>
          
          <Badge className={`${statusConfig.badgeColor} font-semibold text-xs px-3 py-1 border-0`}>
            <span className="mr-1">{statusConfig.icon}</span>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold text-blue-700">{formatNumber(todayTransactions)}</div>
            <div className="text-xs text-blue-600">Sales Today</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Fuel className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold text-purple-700">{activePumps}/{station.pumpCount}</div>
            <div className="text-xs text-purple-600">Active Pumps</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold text-green-700">{station.status === 'active' ? '99%' : '0%'}</div>
            <div className="text-xs text-green-600">Uptime</div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Today's Revenue</div>
              <div className="text-2xl font-bold text-slate-800">
                {todaySales > 0 ? formatCurrency(todaySales, { maximumFractionDigits: 0 }) : '₹0'}
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Modern Visual Station */}
        <div className="mb-6 p-4 bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl relative overflow-hidden">
          <div className="flex justify-center items-end gap-2 h-16">
            {/* Station Building */}
            <div className="relative">
              <div className="w-20 h-12 bg-gradient-to-b from-white to-slate-100 rounded-lg shadow-lg border border-slate-200 relative">
                <div className={`absolute top-1 left-1 right-1 h-3 bg-gradient-to-r ${statusConfig.gradient} rounded-md`}></div>
                <div className="absolute top-5 left-2 right-2 grid grid-cols-3 gap-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-1 bg-slate-200 rounded-sm"></div>
                  ))}
                </div>
              </div>
              
              {/* Canopy */}
              <div className="absolute -top-2 -left-4 -right-4 h-3 bg-gradient-to-r from-slate-300 to-slate-400 rounded-t-lg shadow-md"></div>
            </div>

            {/* Fuel Pumps */}
            {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => (
              <div key={i} className="w-3 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-sm shadow-sm relative">
                <div className="absolute top-1 left-0 right-0 h-1 bg-green-400 rounded-sm animate-pulse"></div>
                <div className="absolute bottom-1 left-0 right-0 h-1 bg-blue-400 rounded-sm"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2 text-xs text-slate-500 font-medium">
            {station.pumpCount} Fuel Dispensers
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onView(station.id)}
            className={`flex-1 bg-gradient-to-r ${statusConfig.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg ${statusConfig.glowColor} hover:shadow-xl transition-all duration-300`}
          >
            <Activity className="mr-2 h-4 w-4" />
            Manage Station
          </Button>
          
          <Button
            onClick={() => onDelete(station.id)}
            variant="outline"
            className="px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </CardContent>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
    </Card>
  );
}
