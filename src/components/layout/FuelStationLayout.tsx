
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FuelStationLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function FuelStationLayout({ title, subtitle, children, className }: FuelStationLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Station Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-lg">{subtitle}</p>
        )}
      </div>

      {/* Fuel Station Floor */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 min-h-[400px]">
        {/* Lane Dividers */}
        <div className="absolute inset-x-6 top-6 bottom-6 flex flex-col">
          <div className="flex-1 border-l-2 border-dashed border-gray-400 opacity-30 ml-4" />
          <div className="flex-1 border-l-2 border-dashed border-gray-400 opacity-30 ml-4" />
        </div>

        {/* Equipment Layout */}
        <div className="relative z-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface PumpBayProps {
  children: ReactNode;
  className?: string;
}

export function PumpBay({ children, className }: PumpBayProps) {
  return (
    <div className={cn(
      "relative bg-white rounded-lg p-4 border-2 border-dashed border-gray-300",
      "hover:border-blue-400 transition-colors duration-300",
      "shadow-lg hover:shadow-xl",
      className
    )}>
      {children}
    </div>
  );
}
