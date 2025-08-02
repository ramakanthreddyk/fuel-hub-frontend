/**
 * @file Logo.tsx
 * @description Modern, scalable logo component for FuelSync
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8', 
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const textSizeClasses = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl'
};

export function Logo({ size = 'md', variant = 'full', className, showText = true }: LogoProps) {
  const LogoIcon = () => (
    <div className={cn(
      'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg',
      sizeClasses[size]
    )}>
      {/* Fuel Drop Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-1/2 w-1/2 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z"
          fill="currentColor"
          className="drop-shadow-sm"
        />
        <path
          d="M12 16C9.24 16 7 18.24 7 21H17C17 18.24 14.76 16 12 16Z"
          fill="currentColor"
          opacity="0.7"
        />
        <circle
          cx="12"
          cy="10"
          r="2"
          fill="white"
          opacity="0.3"
        />
      </svg>
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse opacity-20"></div>
    </div>
  );

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={cn(
        'font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
        textSizeClasses[size]
      )}>
        FuelSync
      </span>
      {size !== 'xs' && size !== 'sm' && (
        <span className="text-xs text-gray-500 -mt-1">Station Management</span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  // Full variant - icon + text
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LogoIcon />
      {showText !== false && <LogoText />}
    </div>
  );
}

// Animated version for loading states
export function AnimatedLogo({ size = 'md', className }: { size?: LogoProps['size']; className?: string }) {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg animate-pulse',
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2 text-white animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className={cn(
          'h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded animate-pulse',
          size === 'xs' ? 'w-12' : size === 'sm' ? 'w-16' : 'w-20'
        )}></div>
        {size !== 'xs' && size !== 'sm' && (
          <div className="h-2 bg-gray-300 rounded mt-1 w-16 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
