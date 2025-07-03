
/**
 * @file components/pumps/PumpCard.tsx
 * @description Enhanced pump card component with mobile-responsive layout
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fuel, Settings, Eye, Activity, Wrench } from 'lucide-react';

interface PumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: string;
    nozzleCount: number;
  };
  onViewNozzles: (id: string) => void;
  onSettings: (id: string) => void;
}

export function PumpCard({ pump, onViewNozzles, onSettings }: PumpCardProps) {
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
            <Wrench className="w-3 h-3 mr-1" />
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
              <span className="truncate">{pump.name}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="space-y-1">
                {pump.serialNumber && (
                  <div className="text-xs text-muted-foreground">
                    Serial: <span className="font-mono">{pump.serialNumber}</span>
                  </div>
                )}
                <div className="text-sm">
                  Nozzles: <span className="font-medium">{pump.nozzleCount}</span>
                </div>
              </div>
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge(pump.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewNozzles(pump.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Nozzles
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSettings(pump.id)}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
