
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryTable } from '@/components/fuel-deliveries/InventoryTable';
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { Fuel, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const { data: inventory } = useFuelInventory();

  // Calculate summary stats
  const totalStations = inventory ? new Set(inventory.map(i => i.stationId)).size : 0;
  const lowStockItems = inventory?.filter(i => i.availableVolume < 500) || [];
  const totalVolume = inventory?.reduce((sum, item) => sum + item.availableVolume, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Inventory</h1>
          <p className="text-muted-foreground">
            Monitor fuel stock levels across all stations
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()} L</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Below 500L threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
          <CardDescription>
            Real-time fuel inventory across all stations. Low stock items are highlighted in red.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
