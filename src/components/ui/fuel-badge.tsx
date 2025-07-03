
import { Badge } from '@/components/ui/badge';
import { Fuel, Zap, Crown } from 'lucide-react';

interface FuelBadgeProps {
  fuelType: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FuelBadge({ fuelType, size = 'md' }: FuelBadgeProps) {
  const getFuelConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'petrol':
        return {
          icon: <Fuel className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          textColor: 'text-white'
        };
      case 'diesel':
        return {
          icon: <Zap className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-orange-500 to-amber-600',
          textColor: 'text-white'
        };
      case 'premium':
        return {
          icon: <Crown className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Fuel className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-gray-500 to-slate-600',
          textColor: 'text-white'
        };
    }
  };

  const config = getFuelConfig(fuelType);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <Badge className={`${config.color} ${config.textColor} ${sizeClasses[size]} border-0 shadow-sm flex items-center gap-1 font-medium`}>
      {config.icon}
      <span className="capitalize">{fuelType}</span>
    </Badge>
  );
}
