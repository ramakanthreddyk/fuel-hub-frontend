
/**
 * @file components/nozzles/NozzleCard.tsx
 * @description Enhanced nozzle card component with mobile-responsive layout
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fuel, Edit, Trash2, Activity } from 'lucide-react';

interface NozzleCardProps {
  nozzle: {
    id: string;
    nozzleNumber: number;
    fuelType: string;
    status: string;
    serialNumber?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRecordReading: (id: string) => void;
}

export function NozzleCard({ nozzle, onEdit, onDelete, onRecordReading }: NozzleCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Maintenance
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Fuel className="h-4 w-4 text-blue-600" />
              <span className="truncate">Nozzle #{nozzle.nozzleNumber}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="space-y-1">
                <div>Fuel: <span className="font-medium capitalize">{nozzle.fuelType}</span></div>
                {nozzle.serialNumber && (
                  <div className="text-xs text-muted-foreground">
                    Serial: <span className="font-mono">{nozzle.serialNumber}</span>
                  </div>
                )}
              </div>
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge(nozzle.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onRecordReading(nozzle.id)}
          >
            <Activity className="w-4 h-4 mr-2" />
            Record Reading
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(nozzle.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(nozzle.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
