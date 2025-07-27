
/**
 * @file components/stations/StationVisual.tsx
 * @description Clean station visual with white theme - no yellow colors
 */
import React from 'react';

interface StationVisualProps {
  stationName: string;
  pumpCount: number;
}

export function StationVisual({ stationName, pumpCount }: StationVisualProps) {
  return (
    <div className="relative bg-white rounded-xl p-6 mb-4 border border-gray-200 overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 left-4 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-gray-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-4 left-8 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Clean Road Base */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 via-gray-50 to-transparent rounded-b-xl">
        {/* Lane Markings */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-6 h-0.5 bg-gray-300 rounded animate-pulse" style={{ animationDelay: `${i * 300}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Station Structure */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Clean Canopy */}
          <div className="absolute -top-4 -left-10 -right-10 h-6 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 rounded-t-xl shadow-lg border border-blue-300/50">
            {/* Support Columns */}
            <div className="absolute top-0 left-4 w-0.5 h-16 bg-gray-400 shadow-sm"></div>
            <div className="absolute top-0 right-4 w-0.5 h-16 bg-gray-400 shadow-sm"></div>
            
            {/* LED Lighting */}
            <div className="absolute bottom-1 left-6 right-6 flex justify-between">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 400}ms` }}></div>
              ))}
            </div>
          </div>

          {/* Main Building */}
          <div className="w-32 h-20 bg-white rounded-lg shadow-lg relative overflow-hidden border border-gray-200">
            {/* Windows */}
            <div className="absolute top-3 left-3 right-3 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-2 bg-gray-100 rounded-sm border border-gray-200"></div>
              ))}
            </div>
            
            {/* Brand Sign */}
            <div className="absolute top-1 left-1 right-1 h-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
              <div className="text-[8px] font-bold text-white truncate px-1 drop-shadow-sm">
                ⛽ {stationName.slice(0, 10)}
              </div>
            </div>
            
            {/* Details */}
            <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
              <div className="h-0.5 bg-gray-200 rounded-full"></div>
              <div className="h-0.5 bg-gray-150 rounded-full"></div>
            </div>

            {/* Entrance */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-t-md border border-gray-200">
              <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Dispensers */}
      <div className="relative flex justify-center space-x-4">
        {Array.from({ length: Math.min(pumpCount, 4) }, (_, i) => (
          <div key={i} className="relative group/pump">
            {/* Dispenser Base */}
            <div className="absolute -bottom-1 -left-1 -right-1 h-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-sm"></div>
            
            {/* Main Dispenser Unit */}
            <div className="relative w-4 h-8 bg-white rounded-t-md shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300">
              {/* Digital Display */}
              <div className="absolute top-1 left-0.5 right-0.5 h-2 bg-gray-700 rounded-sm border border-gray-300">
                <div className="absolute inset-0.5 bg-blue-100 rounded-sm animate-pulse opacity-60"></div>
                <div className="absolute top-0.5 left-0.5 text-[3px] text-blue-600 font-mono">
                  {(Math.random() * 999).toFixed(0)}
                </div>
              </div>
              
              {/* Fuel Indicators */}
              <div className="absolute top-4 left-1 right-1 flex justify-between">
                <div className="w-0.5 h-0.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
              
              {/* Nozzle Holder */}
              <div className="absolute right-0 top-3 w-1 h-2 bg-gray-400 rounded-l-sm shadow-sm">
                <div className="absolute top-0.5 -right-0.5 w-0.5 h-1 bg-gray-300 rounded-full shadow-sm"></div>
              </div>
              
              {/* Fuel Hose */}
              <div className="absolute -right-0.5 top-4 w-0.5 h-3 bg-gray-400 rounded-full animate-sway"></div>
              
              {/* Price Display */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-gray-700 rounded-sm">
                <div className="text-[2px] text-blue-500 font-mono text-center leading-1">
                  ₹{(85 + Math.random() * 15).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Fuel Type Labels */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[6px] font-medium text-gray-600 text-center">
              {i % 3 === 0 ? 'Petrol' : i % 3 === 1 ? 'Diesel' : 'Premium'}
            </div>
          </div>
        ))}
      </div>

      {/* Info Display */}
      <div className="absolute top-3 right-3 text-[8px] text-gray-500 font-medium opacity-60">
        {pumpCount} Dispensers
      </div>

      {/* Activity Indicators */}
      <div className="absolute bottom-1 left-0 w-2 h-1 bg-blue-300 rounded-full animate-bounce opacity-40" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-1 right-0 w-1 h-0.5 bg-gray-300 rounded-full animate-bounce opacity-40" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
