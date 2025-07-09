
/**
 * @file components/stations/StationVisual.tsx
 * @description Visual representation of a fuel station with dispensers
 */
import React from 'react';

interface StationVisualProps {
  stationName: string;
  pumpCount: number;
}

export function StationVisual({ stationName, pumpCount }: StationVisualProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 mb-4 border border-blue-100">
      <div className="flex justify-center">
        <div className="relative">
          {/* Station Building */}
          <div className="w-32 h-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-xl relative overflow-hidden">
            {/* Station Sign */}
            <div className="absolute top-2 left-2 right-2 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-md">
              <div className="text-xs font-bold text-white truncate px-2">
                {stationName.slice(0, 12)}
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
            {Array.from({ length: Math.min(pumpCount, 4) }, (_, i) => (
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
  );
}
