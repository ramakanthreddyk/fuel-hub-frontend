
import * as React from "react";
import { cn } from "@/lib/utils";
import { Fuel, Zap, Droplets } from "lucide-react";

interface FuelBadgeProps {
  fuelType: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FuelBadge({ fuelType, size = 'md', className }: FuelBadgeProps) {
  const getFuelConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'petrol':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
          text: 'text-white',
          icon: Fuel,
          emoji: '⛽'
        };
      case 'diesel':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          text: 'text-white',
          icon: Droplets,
          emoji: '🛢️'
        };
      case 'premium':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          text: 'text-white',
          icon: Fuel,
          emoji: '✨'
        };
      case 'electric':
      case 'ev':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
          text: 'text-white',
          icon: Zap,
          emoji: '⚡'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-600',
          text: 'text-white',
          icon: Fuel,
          emoji: '⛽'
        };
    }
  };

  const config = getFuelConfig(fuelType);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-full font-medium capitalize shadow-md",
      config.bg,
      config.text,
      sizeClasses[size],
      className
    )}>
      <span className="text-lg">{config.emoji}</span>
      <Icon className={iconSizes[size]} />
      {fuelType}
    </span>
  );
}
