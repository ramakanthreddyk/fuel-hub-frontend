
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Fuel, Settings, MoreVertical, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { PumpModel } from '@/models/pump';
import type { PumpCardActions } from '@/models/pump-actions';
import { getPumpStatusConfig } from '@/utils/pump-config';
import { getPumpStatusLabel } from '@/models/pump';

interface CompactPumpCardProps {
  pump: PumpModel;
  actions: PumpCardActions;
}

export function CompactPumpCard({ pump, actions }: Readonly<CompactPumpCardProps>) {
  const statusConfig = getPumpStatusConfig(pump.status);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border",
      pump.needsAttention && "border-amber-200 bg-amber-50/30"
    )}>
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Fuel className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{pump.name}</h3>
              {pump.serialNumber && (
                <p className="text-xs text-gray-500 truncate">Serial: {pump.serialNumber}</p>
              )}
            </div>
          </div>
          <Badge variant={statusConfig.badge.variant} className={cn("text-xs", statusConfig.badge.className)}>
            {getPumpStatusLabel(pump.status)}
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
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => actions.onViewNozzles?.(pump.id)}
            size="sm"
            className="flex-1 h-8"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Nozzles
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {actions.onEdit && (
                <DropdownMenuItem onClick={() => actions.onEdit?.(pump.id)}>
                  <Settings className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {actions.onDelete && (
                <DropdownMenuItem 
                  onClick={() => actions.onDelete?.(pump.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
