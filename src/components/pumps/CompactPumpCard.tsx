
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

import type { Pump } from '@/api/api-contract';

interface CompactPumpCardProps {
  pump: Pump & { nozzleCount: number; serialNumber?: string };
  onViewNozzles?: (pumpId: string) => void;
  onEdit?: (pumpId: string) => void;
  onDelete?: (pumpId: string) => void;
}

export function CompactPumpCard({ pump, onViewNozzles, onEdit, onDelete }: CompactPumpCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' };
      case 'maintenance':
        return { variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { variant: 'outline' as const, className: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const statusConfig = getStatusConfig(pump.status);
  const needsAttention = pump.nozzleCount === 0 || pump.status === 'maintenance';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border",
      needsAttention && "border-amber-200 bg-amber-50/30"
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
          <Badge className={cn("text-xs", statusConfig.className)}>
            {pump.status}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>{pump.nozzleCount} nozzles</span>
            </div>
            {needsAttention && (
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
            onClick={() => onViewNozzles?.(pump.id)}
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
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(pump.id)}>
                  <Settings className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(pump.id)}
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
