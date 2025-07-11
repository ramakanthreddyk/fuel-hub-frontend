
/**
 * @file components/stations/StationVisual.tsx
 * @description Enhanced visual representation of a fuel station with animations and realistic graphics
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface StationVisualProps {
  stationName: string;
  pumpCount: number;
}

export function StationVisual({ stationName, pumpCount }: StationVisualProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50 rounded-2xl p-8 mb-6 border border-blue-200 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Road Markings */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-600 via-gray-500 to-transparent rounded-b-2xl">
        {/* Lane Dividers */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="w-8 h-1 bg-yellow-300 rounded animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Main Station Structure */}
      <div className="relative flex justify-center mb-8">
        <div className="relative">
          {/* Canopy Structure */}
          <div className="absolute -top-6 -left-12 -right-12 h-8 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-t-2xl shadow-2xl transform perspective-500 rotate-x-12">
            {/* Canopy Support Beams */}
            <div className="absolute top-0 left-6 w-1 h-24 bg-gray-600 shadow-lg"></div>
            <div className="absolute top-0 right-6 w-1 h-24 bg-gray-600 shadow-lg"></div>
            
            {/* Canopy Lights */}
            <div className="absolute bottom-2 left-8 right-8 flex justify-between">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-2 h-2 bg-yellow-200 rounded-full animate-pulse shadow-lg shadow-yellow-200/50" style={{ animationDelay: `${i * 300}ms` }}></div>
              ))}
            </div>
          </div>

          {/* Main Building */}
          <div className="w-40 h-28 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            {/* Building Windows */}
            <div className="absolute top-4 left-4 right-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-3 bg-gradient-to-b from-sky-200 to-sky-300 rounded border border-blue-300 shadow-inner"></div>
              ))}
            </div>
            
            {/* Station Brand Sign */}
            <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg transform hover:shadow-xl transition-shadow duration-300">
              <div className="text-xs font-bold text-white truncate px-2 animate-pulse">
                {stationName.slice(0, 14)}
              </div>
            </div>
            
            {/* Building Details */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <div className="h-1.5 bg-blue-300 rounded-full shadow-inner"></div>
              <div className="h-1 bg-blue-300 rounded-full shadow-inner"></div>
              <div className="h-0.5 bg-blue-200 rounded-full shadow-inner"></div>
            </div>

            {/* Entry Door */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg border-2 border-gray-600">
              <div className="absolute top-2 right-1 w-1 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Dispensers Area */}
      <div className="relative flex justify-center space-x-6">
        {Array.from({ length: Math.min(pumpCount, 6) }, (_, i) => (
          <div key={i} className="relative group">
            {/* Dispenser Island */}
            <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-lg"></div>
            
            {/* Main Dispenser Unit */}
            <div className="relative w-6 h-12 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-t-lg shadow-2xl border-2 border-white transform hover:scale-110 transition-transform duration-300 group-hover:shadow-orange-500/50">
              {/* Digital Display */}
              <div className="absolute top-2 left-0.5 right-0.5 h-3 bg-gray-900 rounded-sm border border-gray-700">
                <div className="absolute inset-0.5 bg-green-400 rounded-sm animate-pulse opacity-80"></div>
                <div className="absolute top-0.5 left-0.5 text-[4px] text-black font-mono">
                  {(Math.random() * 999).toFixed(0)}
                </div>
              </div>
              
              {/* Fuel Type Indicators */}
              <div className="absolute top-6 left-1 right-1 flex justify-between">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
              </div>
              
              {/* Nozzle Holster */}
              <div className="absolute right-0 top-4 w-2 h-4 bg-gray-800 rounded-l-lg shadow-lg">
                <div className="absolute top-1 -right-0.5 w-1 h-2 bg-gray-700 rounded-full shadow-md"></div>
              </div>
              
              {/* Fuel Hose */}
              <div className="absolute -right-1 top-6 w-0.5 h-4 bg-gray-700 rounded-full animate-sway"></div>
              
              {/* Price Display */}
              <div className="absolute bottom-1 left-0.5 right-0.5 h-2 bg-black rounded-sm">
                <div className="text-[3px] text-green-400 font-mono text-center leading-2">
                  ₹{(85 + Math.random() * 20).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Fuel Type Labels */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[8px] font-semibold text-gray-600 text-center">
              {i % 3 === 0 ? 'Petrol' : i % 3 === 1 ? 'Diesel' : 'Premium'}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Visual Elements */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 font-medium opacity-60">
        {pumpCount} Dispensers
      </div>

      {/* Animated Traffic */}
      <div className="absolute bottom-2 left-0 w-3 h-1.5 bg-red-500 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-2 right-0 w-2 h-1 bg-blue-500 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-sway {
          animation: sway 2s ease-in-out infinite;
        }
        .perspective-500 {
          perspective: 500px;
        }
        .rotate-x-12 {
          transform: rotateX(12deg);
        }
      `}</style>
    </div>
  );
}
