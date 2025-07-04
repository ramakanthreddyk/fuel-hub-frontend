import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { Fuel, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryStatusCardProps {
  stationId?: string;
}

export function InventoryStatusCard({ stationId }: InventoryStatusCardProps) {
  const { data: inventory = [], isLoading, error, refetch } = useFuelInventory(
    stationId ? { stationId } : undefined
  );

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Inventory Status" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-blue-600" />
            Inventory Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const lowStockItems = inventory.filter(item => (item.currentVolume || item.currentStock) < 1000);
  const criticalStockItems = inventory.filter(item => (item.currentVolume || item.currentStock) < 500);

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-blue-600" />
          Inventory Status
          {criticalStockItems.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {criticalStockItems.length} Critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalStockItems.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {criticalStockItems.length} station(s) have critical fuel levels below 500L
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          {inventory.slice(0, 5).map((item) => {
            const currentLevel = item.currentVolume || item.currentStock;
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <Fuel className={`h-4 w-4 ${
                    currentLevel < 500 ? 'text-red-500' : 
                    currentLevel < 1000 ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{item.stationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.fuelType.charAt(0).toUpperCase() + item.fuelType.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    currentLevel < 500 ? 'text-red-600' : 
                    currentLevel < 1000 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {currentLevel.toLocaleString()}L
                  </p>
                  <Badge variant={
                    currentLevel < 500 ? 'destructive' : 
                    currentLevel < 1000 ? 'secondary' : 'default'
                  } className="text-xs">
                    {currentLevel < 500 ? 'Critical' : 
                     currentLevel < 1000 ? 'Low' : 'Normal'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {inventory.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No inventory data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
