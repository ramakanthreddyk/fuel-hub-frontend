
/**
 * @file components/pumps/RealisticPumpCard.tsx
 * @description Realistic pump card with modern fuel station design
 * Updated: 2025-07-27
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, Eye, Settings, Zap, Hash } from 'lucide-react';

interface RealisticPumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: string;
    nozzleCount: number;
  };
  onViewNozzles: (id: string) => void;
  onSettings: (id: string) => void;
}

export function RealisticPumpCard({ pump, onViewNozzles, onSettings }: RealisticPumpCardProps) {
  const getStatusConfig = () => {
    switch (pump.status.toLowerCase()) {
      case 'active':
        return {
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          accentColor: 'bg-green-500',
          textColor: 'text-green-900'
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
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-100',
          badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
          accentColor: 'bg-gray-500',
          textColor: 'text-gray-900'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="group overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-[1.02]">
      {/* Header Section */}
      <div className={`${statusConfig.bgColor} p-6 pb-4 relative`}>
        {/* Status Indicator */}
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${statusConfig.accentColor} animate-pulse shadow-lg`}></div>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <Fuel className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-xl mb-1 truncate ${statusConfig.textColor}`} title={pump.name}>
                {pump.name}
              </h3>
              {pump.serialNumber && (
                <p className="text-sm text-gray-600 font-mono truncate">
                  Serial: {pump.serialNumber}
                </p>
              )}
            </div>
          </div>
          
          <Badge className={`${statusConfig.badgeColor} font-medium text-sm px-3 py-1 border-0`}>
            {pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Hash className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{pump.nozzleCount}</div>
            <div className="text-xs text-blue-700 font-medium">Nozzles</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${statusConfig.accentColor}`}></div>
            <div className="text-xs text-purple-700 font-medium">Status</div>
          </div>
        </div>

        {/* Realistic Fuel Pump Visual */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
          <div className="flex justify-center items-center">
            {/* Main Pump Unit */}
            <div className="relative">
              {/* Pump Body */}
              <div className="w-20 h-32 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-xl relative">
                {/* Brand Logo Area */}
                <div className="absolute top-2 left-1 right-1 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center shadow-sm">
                  <Fuel className="h-4 w-4 text-white" />
                </div>
                
                {/* Digital Display */}
                <div className="absolute top-12 left-2 right-2 h-6 bg-gray-900 rounded-md border-2 border-gray-700 shadow-inner">
                  <div className="absolute inset-1 bg-green-400 rounded-sm opacity-80 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-green-900 font-bold">
                      {(Math.random() * 999).toFixed(0)}
                    </span>
                  </div>
                </div>
                
                {/* Fuel Type Indicators */}
                <div className="absolute top-20 left-2 right-2 flex justify-between">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                </div>
                
                {/* Nozzle Holsters */}
                <div className="absolute right-0 top-14 flex flex-col space-y-2">
                  {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                    <div key={i} className="w-3 h-4 bg-gray-400 rounded-l-md shadow-sm relative">
                      <div className="absolute top-0.5 -right-1 w-1 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                  ))}
                </div>
                
                {/* Fuel Hoses */}
                <div className="absolute -right-2 top-16 flex flex-col space-y-2">
                  {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                    <div key={i} className="w-1 h-8 bg-gray-400 rounded-full animate-sway" style={{ animationDelay: `${i * 1000}ms` }}></div>
                  ))}
                </div>
                
                {/* Price Displays */}
                <div className="absolute bottom-2 left-1 right-1 space-y-1">
                  {Array.from({ length: Math.min(pump.nozzleCount, 3) }, (_, i) => (
                    <div key={i} className="h-2 bg-gray-900 rounded-sm flex items-center justify-center">
                      <span className="text-[5px] text-green-400 font-mono">
                        ₹{(85 + Math.random() * 15).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Base Platform */}
              <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-gray-500 rounded-b-lg shadow-lg"></div>
              
              {/* Safety Cone */}
              <div className="absolute -left-6 -bottom-4 w-3 h-6 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onViewNozzles(pump.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Eye className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">View Nozzles</span>
            <span className="sm:hidden">Nozzles</span>
          </Button>
          
          <Button
            onClick={() => onSettings(pump.id)}
            variant="outline"
            className="px-4 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
