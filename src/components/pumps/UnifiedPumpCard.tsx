/**
 * @file components/pumps/UnifiedPumpCard.tsx
 * @description Unified pump card component that consolidates all pump card variants
 * Supports multiple display modes: compact, standard, enhanced, realistic
 */
import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Fuel,
  Settings,
  MoreVertical,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Gauge,
  Activity,
  Hash,
  Edit,
  Power,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileFormatters } from '@/utils/mobileFormatters';

// Unified pump interface
export interface PumpData {
  id: string;
  name: string;
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number;
  stationName?: string;
}

// Display variant types
export type PumpCardVariant = 'compact' | 'standard' | 'enhanced' | 'realistic' | 'creative';

// Action handlers interface
export interface PumpCardActions {
  onViewNozzles?: (pumpId: string) => void;
  onEdit?: (pumpId: string) => void;
  onDelete?: (pumpId: string) => void;
  onSettings?: (pumpId: string) => void;
  onPowerToggle?: (pumpId: string) => void;
}

// Main component props
export interface UnifiedPumpCardProps {
  pump: PumpData;
  variant?: PumpCardVariant;
  actions?: PumpCardActions;
  needsAttention?: boolean;
  showStationName?: boolean;
  className?: string;
}

// Status configuration helper
const getStatusConfig = (status: string) => {
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

// Card variant helper for creative mode
const getCardVariant = (id: string) => {
  const variants = [
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

export const UnifiedPumpCard = memo(function UnifiedPumpCard({
  pump,
  variant = 'standard',
  actions = {},
  needsAttention = false,
  showStationName = false,
  className,
}: UnifiedPumpCardProps) {
  const { isMobile } = useMobileFormatters();

  // Memoize expensive calculations
  const statusConfig = useMemo(() => getStatusConfig(pump.status), [pump.status]);
  const cardVariant = useMemo(() => getCardVariant(pump.id), [pump.id]);
  const StatusIcon = statusConfig.icon;

  // Determine if pump needs attention
  const hasAttention = useMemo(() =>
    needsAttention || pump.nozzleCount === 0 || pump.status === 'maintenance',
    [needsAttention, pump.nozzleCount, pump.status]
  );

  // Memoize action handlers to prevent unnecessary re-renders
  const handleViewNozzles = useCallback(() => {
    actions.onViewNozzles?.(pump.id);
  }, [actions.onViewNozzles, pump.id]);

  const handleEdit = useCallback(() => {
    actions.onEdit?.(pump.id);
  }, [actions.onEdit, pump.id]);

  const handleDelete = useCallback(() => {
    actions.onDelete?.(pump.id);
  }, [actions.onDelete, pump.id]);

  const handleSettings = useCallback(() => {
    actions.onSettings?.(pump.id);
  }, [actions.onSettings, pump.id]);

  const handlePowerToggle = useCallback(() => {
    actions.onPowerToggle?.(pump.id);
  }, [actions.onPowerToggle, pump.id]);

  // Render action buttons based on variant
  const renderActions = useCallback(() => {
    const { onViewNozzles, onEdit, onDelete, onSettings, onPowerToggle } = actions;

    if (variant === 'compact') {
      return (
        <div className="flex items-center justify-between gap-2">
          {onViewNozzles && (
            <Button
              onClick={handleViewNozzles}
              size="sm"
              className="flex-1 h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Nozzles
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onSettings && (
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="h-3 w-3 mr-2" />
                  Settings
                </DropdownMenuItem>
              )}
              {onPowerToggle && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handlePowerToggle}>
                    <Power className="h-3 w-3 mr-2" />
                    {pump.status === 'active' ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    // Standard action buttons for other variants
    return (
      <div className="flex gap-2">
        {onViewNozzles && (
          <Button
            onClick={handleViewNozzles}
            size="sm"
            className={cn(
              "flex-1",
              variant === 'enhanced'
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md"
            )}
          >
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">View Nozzles</span>
            <span className="sm:hidden">Nozzles</span>
          </Button>
        )}

        {onSettings && (
          <Button
            onClick={handleSettings}
            size="sm"
            variant="outline"
            className="hover:bg-gray-50 border-gray-200 hover:border-gray-300"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }, [actions, variant, handleViewNozzles, handleEdit, handleDelete, handleSettings, handlePowerToggle, pump.status]);

  // Render based on variant
  if (variant === 'compact') {
    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md border",
        hasAttention && "border-amber-200 bg-amber-50/30",
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
              {hasAttention && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs">Needs attention</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Row */}
          {renderActions()}
        </CardContent>
      </Card>
    );
  }

  // Enhanced variant with metrics
  if (variant === 'enhanced') {
    let shadowColor = 'gray';
    if (pump.status === 'active') shadowColor = 'blue';
    else if (pump.status === 'maintenance') shadowColor = 'amber';
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
                  {(() => {
                    let statusLabel = 'Offline';
                    if (pump.status === 'active') statusLabel = 'Ready';
                    else if (pump.status === 'maintenance') statusLabel = 'Service';
                    return statusLabel;
                  })()}
                </div>
                <div className="text-xs text-emerald-600 font-medium">Status</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {renderActions()}
        </CardContent>
      </Card>
    );
  }

  // Creative variant with animations and gradients
  if (variant === 'creative') {
    return (
      <div className={cn(
        "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] bg-white/90",
        `bg-gradient-to-br ${cardVariant.bg}`,
        cardVariant.border,
        cardVariant.glow,
        "shadow-xl hover:shadow-2xl",
        hasAttention && "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-transparent animate-pulse",
        className
      )}>
        {/* Animated Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-15 transition-opacity duration-500",
          statusConfig.gradient
        )}></div>

        {/* Attention Badge */}
        {hasAttention && (
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

            {hasAttention && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/80 rounded-xl backdrop-blur-sm border border-amber-200/60">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-700">Attention</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {renderActions()}
        </div>
      </div>
    );
  }

  // Standard and realistic variants (similar styling)
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
                  {(() => {
                    let statusIcon = '🚫';
                    if (pump.status === 'active') statusIcon = '⛽';
                    else if (pump.status === 'maintenance') statusIcon = '🔧';
                    return statusIcon;
                  })()}
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
          {hasAttention && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Attention needed</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {renderActions()}
      </CardContent>
    </Card>
  );
});
