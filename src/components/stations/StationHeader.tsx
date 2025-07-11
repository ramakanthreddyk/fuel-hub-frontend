
/**
 * @file components/stations/StationHeader.tsx
 * @description Clean header section with white theme - no yellow colors
 */
import React from 'react';
import { Building2, MapPin, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationHeaderProps {
  name: string;
  address: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export function StationHeader({ name, address, status }: StationHeaderProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-700'
        };
      case 'maintenance':
        return {
          icon: Clock,
          label: 'Maintenance',
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-700'
        };
      case 'inactive':
        return {
          icon: AlertTriangle,
          label: 'Inactive',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{address}</span>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "inline-flex px-3 py-1 rounded-full border items-center gap-2 text-sm font-medium",
        statusConfig.bgColor,
        statusConfig.textColor
      )}>
        <StatusIcon className={cn("w-3 h-3", statusConfig.iconColor)} />
        {statusConfig.label}
      </div>
    </div>
  );
}
