/**
 * @file FuelInventoryPage.tsx
 * @description Page for monitoring fuel inventory
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fuel, AlertTriangle, TrendingDown, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useStations } from '@/hooks/api/useStations';
import { useInventory, useInventorySummary } from '@/hooks/api/useInventory';
import { useGenerateReport } from '@/hooks/api/useReports';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function FuelInventoryPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState('all-stations');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch inventory data
  const { 
    data: inventory = [], 
    isLoading: inventoryLoading, 
    refetch: refetchInventory 
  } = useInventory(selectedStationId && selectedStationId !== 'all-stations' ? selectedStationId : undefined);
  
  // Fetch inventory summary
  const { 
    data: summary, 
    isLoading: summaryLoading, 
    refetch: refetchSummary 
  } = useInventorySummary();
  
  // Generate report mutation
  const generateReport = useGenerateReport();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchInventory(), refetchSummary()]);
    setIsRefreshing(false);
  };

  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
  };

  const handleGenerateReport = () => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    generateReport.mutate({
      name: `Fuel Inventory Report - ${new Date().toLocaleDateString()}`,
      type: 'inventory',
      format: 'pdf',
      dateRange: {
        start: oneMonthAgo.toISOString(),
        end: now.toISOString()
      },
      filters: selectedStationId !== 'all-stations' ? { stationId: selectedStationId } : undefined
    }, {
      onSuccess: () => {
        toast({
          title: "Report Generated",
          description: "Your report is being processed and will be available soon.",
        });
      }
    });
  };

  const getStockStatus = (current: number, capacity: number, threshold: number) => {
    const percentage = (current / capacity) * 100;
    if (current <= threshold) return { status: 'critical', color: 'bg-red-100 text-red-800' };
    if (percentage <= 25) return { status: 'low', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'normal', color: 'bg-green-100 text-green-800' };
  };

  const isLoading = stationsLoading || inventoryLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FuelLoader size="lg" text="Loading fuel inventory..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fuel Inventory</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Monitor fuel stock levels across all stations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/dashboard/fuel-inventory/update')} 
            variant="default" 
            size="sm"
          >
            <Fuel className="mr-2 h-4 w-4" />
            Update Inventory
          </Button>
          <Button 
            onClick={handleGenerateReport} 
            variant="outline" 
            size="sm"
            disabled={generateReport.isPending}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {generateReport.isPending ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Station Filter (only show if backend supports) */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Filter by Station:</div>
          <div className="flex-1">
            <Select 
              value={selectedStationId} 
              onValueChange={handleStationChange}
              disabled={false} // Set to true if backend does not support filtering
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-stations">All Stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTanks || inventory.length}</div>
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
              {summary?.lowStockCount ?? inventory.filter(item => 
                item.status === 'critical' || item.status === 'low' || 
                (item.currentStock || 0) <= (item.lowThreshold || 0)
              ).length}
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
              {(() => {
                if (summary?.averageFillPercentage) {
                  return `${summary.averageFillPercentage}%`;
                }
                if (inventory.length === 0) {
                  return '0%';
                }
                const totalCapacity = inventory.reduce((acc, item) => acc + (item.capacity || 0), 0);
                const totalStock = inventory.reduce((acc, item) => acc + (item.currentStock || 0), 0);
                if (totalCapacity === 0) {
                  return '0%';
                }
                return `${Math.round((totalStock / totalCapacity) * 100)}%`;
              })()}
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
              {(
                summary?.totalCapacity ??
                inventory.reduce((acc, item) => acc + (item.capacity || 0), 0)
              ).toLocaleString()}L
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
          {inventory.length === 0 ? (
            <div className="text-center p-8">
              <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No inventory data available</h3>
              <p className="text-muted-foreground mb-4">
                {selectedStationId !== 'all-stations' ? 
                  "This station doesn't have any fuel inventory records." : 
                  "There are no fuel inventory records in the system."}
              </p>
              {selectedStationId === 'all-stations' && (
                <Button asChild>
                  <Link to="/dashboard/stations">
                    <Fuel className="mr-2 h-4 w-4" />
                    Manage Stations
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => {
                const currentStock = item.currentStock ?? 0;
                const capacity = item.capacity ?? 0;
                const stockStatus = getStockStatus(currentStock, capacity, item.lowThreshold);
                const fillPercentage = capacity > 0 ? (currentStock / capacity) * 100 : 0;
                const fuelTypeColors = {
                  petrol: 'from-blue-500 to-blue-600',
                  diesel: 'from-yellow-500 to-yellow-600',
                  premium: 'from-purple-500 to-purple-600'
                };

                return (
                  <Card key={item.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${fuelTypeColors[item.fuelType] || 'from-gray-500 to-gray-600'}`}></div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold capitalize">{item.fuelType}</h3>
                        </div>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{item.stationName}</p>
                      
                      {/* Circular Progress */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-200"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={fillPercentage <= 25 ? 'text-red-500' : fillPercentage <= 50 ? 'text-yellow-500' : 'text-green-500'}
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={`${fillPercentage}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{fillPercentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stock Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">{currentStock.toLocaleString()}L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Capacity:</span>
                          <span className="font-medium">{capacity.toLocaleString()}L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="font-medium">{(capacity - currentStock).toLocaleString()}L</span>
                        </div>
                      </div>
                      
                      {/* Linear Progress */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              fillPercentage <= 25 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                              fillPercentage <= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                              'bg-gradient-to-r from-green-400 to-green-500'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}