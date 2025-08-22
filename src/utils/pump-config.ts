/**
 * @file utils/pump-config.ts
 * @description Configuration utilities for pump display and status
 */
import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import type { EntityStatus } from '@/api/api-contract';
import type { PumpStatusConfig, CardVariantStyle } from '@/models/pump';

/**
 * Get status configuration for pump display
 */
export const getPumpStatusConfig = (status: EntityStatus): PumpStatusConfig => {
  switch (status) {
    case 'active':
      return {
        badge: { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        gradient: 'from-green-500 via-emerald-600 to-teal-600',
        accentColor: 'bg-green-500',
      };
    case 'maintenance':
      return {
        badge: { variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 border-amber-200' },
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        gradient: 'from-amber-500 via-orange-600 to-red-600',
        accentColor: 'bg-amber-500',
      };
    case 'inactive':
      return {
        badge: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-600 border-gray-200' },
        icon: Clock,
        iconColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        gradient: 'from-gray-500 via-slate-600 to-zinc-600',
        accentColor: 'bg-gray-500',
      };
    default:
      return {
        badge: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-600 border-gray-200' },
        icon: AlertTriangle,
        iconColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        gradient: 'from-gray-500 via-slate-600 to-zinc-600',
        accentColor: 'bg-gray-500',
      };
  }
};

/**
 * Get creative card variant styling based on pump ID
 */
export const getCardVariantStyle = (id: string): CardVariantStyle => {
  const variants: CardVariantStyle[] = [
    {
      bg: 'from-blue-50 via-indigo-50 to-blue-50',
      border: 'border-blue-200',
      glow: 'hover:ring-2 hover:ring-blue-300/50 hover:shadow-blue-200/40'
    },
    {
      bg: 'from-teal-50 via-cyan-50 to-teal-50',
      border: 'border-teal-200',
      glow: 'hover:ring-2 hover:ring-teal-300/50 hover:shadow-teal-200/40'
    },
    {
      bg: 'from-purple-50 via-violet-50 to-purple-50',
      border: 'border-purple-200',
      glow: 'hover:ring-2 hover:ring-purple-300/50 hover:shadow-purple-200/40'
    },
  ];
  
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return variants[Math.abs(hash) % variants.length];
};

/**
 * Get shadow color class name based on pump status
 */
export const getShadowColor = (status: EntityStatus): string => {
  switch (status) {
    case 'active': return 'blue';
    case 'maintenance': return 'amber';
    case 'inactive': return 'gray';
    default: return 'gray';
  }
};
