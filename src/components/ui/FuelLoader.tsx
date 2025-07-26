import { cn } from '@/lib/utils';

interface FuelLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function FuelLoader({ className, size = 'md', text }: FuelLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Fuel pump icon with animation */}
        <div className="relative w-full h-full">
          {/* Pump base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gray-700 rounded-b-sm"></div>
          
          {/* Pump body */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-blue-600 rounded-t-lg border-2 border-blue-700">
            {/* Display screen */}
            <div className="absolute top-1 left-1 right-1 h-2 bg-green-400 rounded-sm animate-pulse"></div>
            
            {/* Fuel level indicator */}
            <div className="absolute bottom-1 left-1 right-1 h-3 bg-blue-800 rounded-sm overflow-hidden">
              <div className="h-full bg-gradient-to-t from-yellow-400 to-orange-500 animate-pulse" 
                   style={{ 
                     animation: 'fuelFill 2s ease-in-out infinite alternate',
                     height: '60%'
                   }}>
              </div>
            </div>
          </div>
          
          {/* Nozzle */}
          <div className="absolute top-2 right-0 w-2 h-1 bg-gray-600 rounded-full"></div>
          <div className="absolute top-2 right-2 w-3 h-0.5 bg-gray-600"></div>
          
          {/* Fuel drops animation */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-bounce" 
               style={{ animationDelay: '0s', animationDuration: '1.5s' }}></div>
          <div className="absolute top-0 right-0 w-1 h-1 bg-blue-400 rounded-full animate-bounce" 
               style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
        </div>
      </div>
      
      {text && (
        <div className="text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fuelFill {
          0% { height: 20%; }
          100% { height: 80%; }
        }
      `}</style>
    </div>
  );
}