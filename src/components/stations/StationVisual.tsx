
/**
 * @file components/stations/StationVisual.tsx
 * @description Professional station visual with refined colors and animations
 */
import React from 'react';

interface StationVisualProps {
  stationName: string;
  pumpCount: number;
}

export function StationVisual({ stationName, pumpCount }: StationVisualProps) {
  return (
    <div className="relative bg-gradient-to-br from-muted/50 via-background to-muted/30 rounded-xl p-6 mb-4 border border-border/50 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-secondary rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-4 left-8 w-1 h-1 bg-accent rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Professional Road Base */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted via-muted/80 to-transparent rounded-b-xl">
        {/* Subtle Lane Markings */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-6 h-0.5 bg-muted-foreground/30 rounded animate-pulse" style={{ animationDelay: `${i * 300}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Modern Station Structure */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Professional Canopy */}
          <div className="absolute -top-4 -left-10 -right-10 h-6 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-t-xl shadow-lg">
            {/* Support Columns */}
            <div className="absolute top-0 left-4 w-0.5 h-16 bg-muted-foreground/40 shadow-sm"></div>
            <div className="absolute top-0 right-4 w-0.5 h-16 bg-muted-foreground/40 shadow-sm"></div>
            
            {/* Modern LED Lighting */}
            <div className="absolute bottom-1 left-6 right-6 flex justify-between">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 400}ms` }}></div>
              ))}
            </div>
          </div>

          {/* Main Building - Professional Design */}
          <div className="w-32 h-20 bg-gradient-to-b from-card via-card to-muted/50 rounded-lg shadow-lg relative overflow-hidden border border-border/50">
            {/* Modern Windows */}
            <div className="absolute top-3 left-3 right-3 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-2 bg-muted rounded-sm border border-border/30"></div>
              ))}
            </div>
            
            {/* Professional Brand Sign */}
            <div className="absolute top-1 left-1 right-1 h-6 bg-gradient-to-r from-primary/80 to-primary/60 rounded-md flex items-center justify-center shadow-sm">
              <div className="text-[8px] font-semibold text-primary-foreground truncate px-1">
                {stationName.slice(0, 12)}
              </div>
            </div>
            
            {/* Architectural Details */}
            <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
              <div className="h-0.5 bg-muted-foreground/20 rounded-full"></div>
              <div className="h-0.5 bg-muted-foreground/15 rounded-full"></div>
            </div>

            {/* Professional Entrance */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-muted to-muted-foreground/20 rounded-t-md border border-border/40">
              <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-primary/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Fuel Dispensers */}
      <div className="relative flex justify-center space-x-4">
        {Array.from({ length: Math.min(pumpCount, 4) }, (_, i) => (
          <div key={i} className="relative group/pump">
            {/* Dispenser Base */}
            <div className="absolute -bottom-1 -left-1 -right-1 h-3 bg-gradient-to-b from-muted to-muted-foreground/20 rounded-lg shadow-sm"></div>
            
            {/* Main Dispenser Unit - Professional Design */}
            <div className="relative w-4 h-8 bg-gradient-to-b from-card via-muted/50 to-muted rounded-t-md shadow-md border border-border/50 transform hover:scale-105 transition-transform duration-300">
              {/* Digital Display */}
              <div className="absolute top-1 left-0.5 right-0.5 h-2 bg-muted-foreground/90 rounded-sm border border-border">
                <div className="absolute inset-0.5 bg-primary/20 rounded-sm animate-pulse opacity-60"></div>
                <div className="absolute top-0.5 left-0.5 text-[3px] text-primary font-mono">
                  {(Math.random() * 999).toFixed(0)}
                </div>
              </div>
              
              {/* Professional Fuel Indicators */}
              <div className="absolute top-4 left-1 right-1 flex justify-between">
                <div className="w-0.5 h-0.5 bg-green-500/80 rounded-full animate-pulse"></div>
                <div className="w-0.5 h-0.5 bg-blue-500/80 rounded-full animate-pulse delay-300"></div>
              </div>
              
              {/* Nozzle Holder */}
              <div className="absolute right-0 top-3 w-1 h-2 bg-muted-foreground/60 rounded-l-sm shadow-sm">
                <div className="absolute top-0.5 -right-0.5 w-0.5 h-1 bg-muted-foreground/40 rounded-full shadow-sm"></div>
              </div>
              
              {/* Fuel Hose */}
              <div className="absolute -right-0.5 top-4 w-0.5 h-3 bg-muted-foreground/50 rounded-full animate-sway"></div>
              
              {/* Price Display */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-muted-foreground/90 rounded-sm">
                <div className="text-[2px] text-primary/80 font-mono text-center leading-1">
                  ₹{(85 + Math.random() * 15).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Fuel Type Labels */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[6px] font-medium text-muted-foreground text-center">
              {i % 3 === 0 ? 'Petrol' : i % 3 === 1 ? 'Diesel' : 'Premium'}
            </div>
          </div>
        ))}
      </div>

      {/* Professional Info Display */}
      <div className="absolute top-3 right-3 text-[8px] text-muted-foreground font-medium opacity-60">
        {pumpCount} Dispensers
      </div>

      {/* Subtle Activity Indicators */}
      <div className="absolute bottom-1 left-0 w-2 h-1 bg-primary/40 rounded-full animate-bounce opacity-40" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-1 right-0 w-1 h-0.5 bg-secondary/40 rounded-full animate-bounce opacity-40" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

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
