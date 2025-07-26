/**
 * @file pages/dashboard/DailySalesPage.tsx
 * @description Daily sales report page showing hierarchical sales data
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Fuel, 
  DollarSign, 
  Calendar,
  Building2,
  Zap,
  Droplets
} from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useDailySales } from '@/hooks/api/useDailySales';
import { formatCurrency, formatVolume } from '@/utils/formatters';

export default function DailySalesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: salesReport, isLoading, error } = useDailySales(selectedDate);

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return 'bg-green-100 text-green-800 border-green-300';
      case 'diesel': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Sales Report</h1>
          <p className="text-gray-600">Detailed breakdown of sales by station, pump, and nozzle</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {salesReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesReport.grandTotalSales)}</div>
              <p className="text-xs text-muted-foreground">Across all stations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatVolume(salesReport.grandTotalVolume)}</div>
              <p className="text-xs text-muted-foreground">Fuel dispensed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesReport.stations.length}</div>
              <p className="text-xs text-muted-foreground">Reporting stations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <FuelLoader size="md" text="Loading daily sales..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading sales data: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Sales Data */}
      {salesReport && (
        <div className="space-y-6">
          {salesReport.stations.map((station) => (
            <Card key={station.stationId} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">{station.stationName}</CardTitle>
                      <p className="text-sm text-gray-600">{station.pumps.length} pumps active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(station.totalSales)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatVolume(station.totalVolume)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {station.pumps.map((pump) => (
                    <Card key={pump.pumpId} className="border border-gray-200">
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-orange-500" />
                            <h4 className="font-semibold">{pump.pumpName}</h4>
                            <Badge variant="outline">{pump.nozzles.length} nozzles</Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {formatCurrency(pump.totalSales)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatVolume(pump.totalVolume)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {pump.nozzles.map((nozzle) => (
                            <div 
                              key={nozzle.nozzleId}
                              className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Fuel className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">Nozzle #{nozzle.nozzleNumber}</span>
                                </div>
                                <Badge className={getFuelTypeColor(nozzle.fuelType)}>
                                  {nozzle.fuelType}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Volume:</span>
                                  <span className="font-medium">{formatVolume(nozzle.totalVolume)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Sales:</span>
                                  <span className="font-medium text-green-600">
                                    {formatCurrency(nozzle.totalSales)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Readings:</span>
                                  <span className="font-medium">{nozzle.readingsCount}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Data State */}
      {salesReport && salesReport.stations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales data</h3>
            <p className="text-gray-600">No sales recorded for {selectedDate}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}