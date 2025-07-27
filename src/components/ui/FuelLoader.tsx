
import { cn } from "@/lib/utils";

interface FuelLoaderProps {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FuelLoader({ className, text = 'Loading...', size = 'md' }: FuelLoaderProps) {
  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-6', className)}>
      <div className={cn('relative flex flex-col items-center justify-center', sizeClasses[size])}>
        {/* Fuel Station Structure */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* Canopy */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-2xl shadow-lg z-10">
            {/* Support Pillars */}
            <div className="absolute top-0 left-4 w-2 h-16 bg-gray-400 rounded-b-lg shadow-md"></div>
            <div className="absolute top-0 right-4 w-2 h-16 bg-gray-400 rounded-b-lg shadow-md"></div>
            
            {/* LED Strip */}
            <div className="absolute bottom-1 left-6 right-6 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            
            {/* Brand Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Main Station Building */}
          <div className="relative w-3/4 h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-xl border border-gray-300 z-5 mt-6">
            {/* Windows */}
            <div className="absolute top-2 left-2 right-2 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-2 bg-blue-100 rounded-sm border border-blue-200 animate-pulse" 
                     style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
            
            {/* Entrance */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gray-300 rounded-t-lg border border-gray-400">
              <div className="absolute top-1 left-1 w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Fuel Dispensers */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {/* Dispenser Unit */}
                <div className="relative w-6 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-md shadow-lg">
                  {/* Digital Display */}
                  <div className="absolute top-1 left-0.5 right-0.5 h-3 bg-black rounded-sm border border-gray-600">
                    <div className="absolute inset-0.5 bg-green-400 rounded-sm animate-pulse opacity-80"></div>
                    <div className="absolute top-0.5 left-0.5 text-[4px] text-green-300 font-mono leading-none">
                      {(Math.random() * 999).toFixed(0)}
                    </div>
                  </div>
                  
                  {/* Fuel Type Indicators */}
                  <div className="absolute top-5 left-1 right-1 flex justify-between">
                    <div className={`w-1 h-1 rounded-full animate-pulse ${
                      i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" 
                         style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  {/* Nozzle Holder */}
                  <div className="absolute right-0 top-6 w-2 h-3 bg-gray-500 rounded-l-md shadow-sm">
                    <div className="absolute top-1 -right-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 h-2 bg-gray-900 rounded-sm border border-gray-600">
                    <div className="text-[3px] text-orange-400 font-mono text-center leading-2">
                      ₹{(85 + Math.random() * 15).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Base Platform */}
                <div className="w-8 h-3 bg-gray-600 rounded-b-lg shadow-md"></div>
                
                {/* Fuel Hose */}
                <div className="absolute right-0 top-6 w-0.5 h-6 bg-gray-400 rounded-full animate-sway opacity-80"></div>
                
                {/* Fuel Type Label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[6px] font-medium text-gray-600">
                  {i === 0 ? 'Petrol' : i === 1 ? 'Diesel' : 'Premium'}
                </div>
              </div>
            ))}
          </div>

          {/* Fuel Tank (Underground visualization) */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-300 rounded-full border border-gray-400 shadow-inner">
            <div className="absolute inset-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 animate-fuel-flow rounded-full"></div>
            </div>
          </div>

          {/* Animated Fuel Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className={cn(
          'text-gray-600 font-medium animate-pulse text-center px-4',
          textSizeClasses[size]
        )}>
          {text}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-progress rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes fuel-flow {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(0%); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.8; 
          }
        }
        
        .animate-fuel-flow {
          animation: fuel-flow 3s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        
        .animate-sway {
          animation: sway 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
