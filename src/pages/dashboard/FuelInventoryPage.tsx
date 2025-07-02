
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function FuelInventoryPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data - replace with actual API data
  const inventoryData = [
    { id: '1', fuelType: 'Petrol', currentStock: 1500, capacity: 2000, lowThreshold: 500, station: 'Main Street Station' },
    { id: '2', fuelType: 'Diesel', currentStock: 800, capacity: 2000, lowThreshold: 500, station: 'Main Street Station' },
    { id: '3', fuelType: 'Premium', currentStock: 300, capacity: 1000, lowThreshold: 200, station: 'Highway Station' },
  ];

  const getStockStatus = (current: number, threshold: number) => {
    if (current <= threshold) return { status: 'low', color: 'bg-red-100 text-red-800' };
    if (current <= threshold * 1.5) return { status: 'medium', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'good', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fuel Inventory</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Monitor fuel stock levels across all stations
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all stations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryData.filter(item => item.currentStock <= item.lowThreshold).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fill</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(inventoryData.reduce((acc, item) => acc + (item.currentStock / item.capacity * 100), 0) / inventoryData.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all tanks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryData.reduce((acc, item) => acc + item.capacity, 0).toLocaleString()}L
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Stock Levels</CardTitle>
          <CardDescription>
            Current inventory status for all fuel types across stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.lowThreshold);
              const fillPercentage = (item.currentStock / item.capacity) * 100;

              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{item.fuelType}</h3>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.station}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          fillPercentage <= 25 ? 'bg-red-500' :
                          fillPercentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-semibold">
                      {item.currentStock.toLocaleString()}L
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of {item.capacity.toLocaleString()}L
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {fillPercentage.toFixed(1)}% full
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
