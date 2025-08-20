
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Settings, Trash2, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactNozzleCardProps {
  nozzle: {
    id: string;
  name: string;
    fuelType: string;
    status: string;
  };
  onRecordReading?: (nozzleId: string) => void;
  onEdit?: (nozzleId: string) => void;
  onDelete?: (nozzleId: string) => void;
}

export function CompactNozzleCard({ nozzle, onRecordReading, onEdit, onDelete }: CompactNozzleCardProps) {
  const getFuelConfig = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return { 
          icon: '⛽', 
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          cardBg: 'bg-blue-50/30 border-blue-200'
        };
      case 'diesel':
        return { 
          icon: '🛢️', 
          className: 'bg-green-100 text-green-800 border-green-200',
          cardBg: 'bg-green-50/30 border-green-200'
        };
      case 'premium':
        return { 
          icon: '⭐', 
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          cardBg: 'bg-purple-50/30 border-purple-200'
        };
      default:
        return { 
          icon: '⛽', 
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          cardBg: 'bg-gray-50/30 border-gray-200'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { className: 'bg-green-100 text-green-800 border-green-200' };
      case 'maintenance':
        return { className: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { className: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const fuelConfig = getFuelConfig(nozzle.fuelType);
  const statusConfig = getStatusConfig(nozzle.status);
  const isActive = nozzle.status.toLowerCase() === 'active';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border",
      fuelConfig.cardBg
    )}>
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="text-lg">{fuelConfig.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900">Nozzle {nozzle.name}</h3>
              <Badge className={cn("text-xs mt-1", fuelConfig.className)}>
                {nozzle.fuelType}
              </Badge>
            </div>
          </div>
          <Badge className={cn("text-xs", statusConfig.className)}>
            {nozzle.status}
          </Badge>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <Droplets className="h-3 w-3 text-gray-500" />
          <span className="text-gray-600">
            {isActive ? 'Ready for readings' : 'Not available'}
          </span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onRecordReading?.(nozzle.id)}
            disabled={!isActive}
            size="sm"
            className="flex-1 h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            Record Reading
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(nozzle.id)}>
                  <Settings className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(nozzle.id)}
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
