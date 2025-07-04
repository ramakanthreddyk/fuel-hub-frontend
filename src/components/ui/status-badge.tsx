
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Settings } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const getStatusConfig = (statusValue: string) => {
    switch (statusValue.toLowerCase()) {
      case 'active':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          text: 'text-white',
          icon: CheckCircle,
          glow: 'shadow-lg shadow-green-500/30'
        };
      case 'maintenance':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
          text: 'text-white',
          icon: Settings,
          glow: 'shadow-lg shadow-yellow-500/30'
        };
      case 'inactive':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-600',
          text: 'text-white',
          icon: XCircle,
          glow: 'shadow-lg shadow-red-500/30'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-600',
          text: 'text-white',
          icon: AlertTriangle,
          glow: 'shadow-lg shadow-gray-500/30'
        };
    }
  };

  const config = getStatusConfig(status);
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
      "inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wide",
      config.bg,
      config.text,
      config.glow,
      sizeClasses[size],
      className
    )}>
      <Icon className={iconSizes[size]} />
      {status}
    </span>
  );
}
