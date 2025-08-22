/**
 * @file components/pumps/PumpCardVariants.tsx
 * @description Different pump card display variants
 */
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Fuel,
  Settings,
  AlertTriangle,
  Gauge,
  Zap,
  Hash,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileFormatters } from '@/utils/mobileFormatters';
import type { 
  PumpModel, 
  PumpCardVariant, 
  PumpStatusConfig, 
  CardVariantStyle 
} from '@/models/pump';
import type { PumpCardActions } from '@/models/pump-actions';
import { CompactPumpActions, StandardPumpActions } from './PumpActions';
import { getPumpStatusLabel, getPumpStatusEmoji } from '@/models/pump';

interface PumpCardVariantProps {
  readonly pump: PumpModel;
  readonly statusConfig: PumpStatusConfig;
  readonly actions: PumpCardActions;
  readonly showStationName: boolean;
  readonly className?: string;
}

/**
 * Compact pump card - minimal space, essential info only
 */
export const CompactPumpCard = memo(function CompactPumpCard({
  pump,
  statusConfig,
  actions,
  showStationName,
  className,
}: PumpCardVariantProps) {
  const { isMobile } = useMobileFormatters();

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border",
      pump.needsAttention && "border-amber-200 bg-amber-50/30",
      className
    )}>
      <CardContent className={isMobile ? "p-3" : "p-4"}>
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className={`bg-blue-50 rounded-lg ${isMobile ? 'p-1.5' : 'p-2'}`}>
              <Fuel className={`text-blue-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
                {pump.name}
              </h3>
              {pump.serialNumber && (
                <p className="text-xs text-gray-500 truncate">
                  {isMobile ? pump.serialNumber : `Serial: ${pump.serialNumber}`}
                </p>
              )}
              {showStationName && pump.stationName && (
                <p className="text-xs text-blue-600 truncate">{pump.stationName}</p>
              )}
            </div>
          </div>
          <Badge className={cn("text-xs flex-shrink-0 ml-2", statusConfig.badge.className)}>
            {isMobile ? pump.status.charAt(0).toUpperCase() : pump.status}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>{pump.nozzleCount} nozzles</span>
            </div>
            {pump.needsAttention && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs">Needs attention</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Row */}
        <CompactPumpActions 
          actions={actions}
          pumpId={pump.id}
          pumpStatus={pump.status}
        />
      </CardContent>
    </Card>
  );
});

/**
 * Enhanced pump card with metrics grid
 */
export const EnhancedPumpCard = memo(function EnhancedPumpCard({
  pump,
  statusConfig,
  actions,
  showStationName,
  className,
}: PumpCardVariantProps) {
  const StatusIcon = statusConfig.icon;
  
  const getShadowColor = (status: string): string => {
    if (status === 'active') return 'blue';
    if (status === 'maintenance') return 'amber';
    return 'gray';
  };
  
  const shadowColor = getShadowColor(pump.status);

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 border-l-4",
      statusConfig.borderColor.replace('border-', 'border-l-'),
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
              `bg-gradient-to-br ${statusConfig.gradient} shadow-lg shadow-${shadowColor}-500/25`
            )}>
              <Fuel className="h-6 w-6 text-white" />
              {pump.status === 'maintenance' && (
                <div className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">{pump.name}</CardTitle>
              {pump.serialNumber && (
                <p className="text-sm text-gray-500 font-medium">S/N: {pump.serialNumber}</p>
              )}
              {showStationName && pump.stationName && (
                <p className="text-sm text-blue-600 font-medium">{pump.stationName}</p>
              )}
            </div>
          </div>
          <Badge variant={statusConfig.badge.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {pump.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Gauge className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-700">{pump.nozzleCount}</div>
              <div className="text-xs text-blue-600 font-medium">Nozzles</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <Zap className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-lg font-bold text-emerald-700">
                {getPumpStatusLabel(pump.status)}
              </div>
              <div className="text-xs text-emerald-600 font-medium">Status</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <StandardPumpActions 
          actions={actions}
          variant="enhanced"
          pumpId={pump.id}
        />
      </CardContent>
    </Card>
  );
});

/**
 * Creative pump card with animations and gradients
 */
export const CreativePumpCard = memo(function CreativePumpCard({
  pump,
  statusConfig,
  actions,
  showStationName,
  className,
  cardVariant,
}: PumpCardVariantProps & { cardVariant: CardVariantStyle }) {
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
      `bg-gradient-to-br ${cardVariant.bg}`,
      cardVariant.border,
      cardVariant.glow,
      "shadow-xl hover:shadow-2xl",
      pump.needsAttention && "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-transparent animate-pulse",
      className
    )}>
      {/* Animated Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-15 transition-opacity duration-500",
        statusConfig.gradient
      )}></div>

      {/* Attention Badge */}
      {pump.needsAttention && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-2 shadow-lg shadow-amber-300/50 animate-bounce">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}

      {/* Floating Pump Icon with Glow */}
      <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-300/30">
        <Fuel className="h-7 w-7 text-blue-600 drop-shadow-sm" />
        {pump.status === 'active' && (
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
        )}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
              {pump.name}
            </h3>
            <Badge className={cn("text-xs font-semibold", statusConfig.badge.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {pump.status}
            </Badge>
          </div>

          {pump.serialNumber && (
            <p className="text-sm text-gray-600 font-medium">Serial: {pump.serialNumber}</p>
          )}
          {showStationName && pump.stationName && (
            <p className="text-sm text-blue-600 font-medium">{pump.stationName}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-xl backdrop-blur-sm border border-white/40">
            <Gauge className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-700">{pump.nozzleCount} Nozzles</span>
          </div>

          {pump.needsAttention && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/80 rounded-xl backdrop-blur-sm border border-amber-200/60">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-amber-700">Attention</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <StandardPumpActions 
          actions={actions}
          variant="creative"
          pumpId={pump.id}
        />
      </div>
    </div>
  );
});

/**
 * Standard/Realistic pump card
 */
export const StandardPumpCard = memo(function StandardPumpCard({
  pump,
  statusConfig,
  actions,
  showStationName,
  variant = 'standard',
  className,
}: PumpCardVariantProps & { variant?: 'standard' | 'realistic' }) {
  const StatusIcon = statusConfig.icon;
  const isRealistic = variant === 'realistic';

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300",
      isRealistic && `bg-gradient-to-br ${statusConfig.bgColor.replace('bg-', 'from-')} to-white`,
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative p-3 rounded-xl shadow-lg",
              isRealistic ? "bg-slate-800" : `bg-gradient-to-br ${statusConfig.gradient}`
            )}>
              {isRealistic ? (
                <span className="text-2xl">
                  {getPumpStatusEmoji(pump.status)}
                </span>
              ) : (
                <Fuel className="h-6 w-6 text-white" />
              )}
              {pump.status === 'active' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{pump.name}</h3>
              {pump.serialNumber && (
                <p className="text-sm text-gray-500">S/N: {pump.serialNumber}</p>
              )}
              {showStationName && pump.stationName && (
                <p className="text-sm text-blue-600">{pump.stationName}</p>
              )}
            </div>
          </div>
          <Badge className={statusConfig.badge.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {pump.status}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4" />
            <span>ID: {pump.id.slice(-6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>{pump.nozzleCount} nozzles</span>
          </div>
          {pump.needsAttention && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Attention needed</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <StandardPumpActions 
          actions={actions}
          variant={variant}
          pumpId={pump.id}
        />
      </CardContent>
    </Card>
  );
});
