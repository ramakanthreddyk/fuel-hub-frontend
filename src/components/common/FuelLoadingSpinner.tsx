
import { cn } from '@/lib/utils';
import { Fuel, Droplets } from 'lucide-react';

interface FuelLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function FuelLoadingSpinner({ size = 'md', className, text = 'Loading...' }: FuelLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {/* Animated fuel pump */}
      <div className="relative">
        <div className={cn(
          'animate-bounce rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-3 shadow-lg',
          sizeClasses[size]
        )}>
          <Fuel className="h-full w-full text-white" />
        </div>
        
        {/* Fuel droplets animation */}
        <div className="absolute -top-2 -right-2">
          <Droplets className={cn(
            'text-blue-400 animate-pulse',
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
          )} />
        </div>
      </div>
      
      {/* Fuel gauge animation */}
      <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" 
          style={{ 
            width: '60%',
            animation: 'fuel-fill 2s ease-in-out infinite alternate'
          }}
        />
      </div>
      
      {text && (
        <p className={cn(
          'text-gray-600 font-medium animate-pulse',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
      
      <style>
        {`
          @keyframes fuel-fill {
            0% { width: 20%; }
            50% { width: 80%; }
            100% { width: 60%; }
          }
        `}
      </style>
    </div>
  );
}
