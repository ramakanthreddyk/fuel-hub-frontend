import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, TrendingUp, Calendar, DollarSign, Clock, Fuel } from "lucide-react";
import { useTodaysSales } from "@/hooks/api/useTodaysSales";
import { useStationRanking, useHourlySales, useFuelPerformance } from "@/hooks/useAnalytics";
import { useStations } from "@/hooks/api/useStations";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAutoLoader } from "@/hooks/useAutoLoader";

export default function AnalyticsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const { data: todaysSales, isLoading, refetch } = useTodaysSales(selectedDate);
  const { data: stationRanking, isLoading: rankingLoading } = useStationRanking(selectedPeriod);
  const { data: stations = [] } = useStations();
  const { data: fuelPerformance, isLoading: fuelLoading } = useFuelPerformance(selectedStationId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useAutoLoader(isLoading, 'Loading analytics...');
  useAutoLoader(rankingLoading, 'Loading station rankings...');
  useAutoLoader(fuelLoading, 'Loading fuel performance...');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Sales performance and business insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(todaysSales?.totalEntries || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Transactions on {selectedDate}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(todaysSales?.totalAmount || 0, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500">Revenue on {selectedDate}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Stations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todaysSales?.salesByStation?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">Stations with sales</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todaysSales?.totalEntries > 0 
                      ? formatCurrency((todaysSales?.totalAmount || 0) / todaysSales.totalEntries, { maximumFractionDigits: 0 })
                      : '₹0'
                    }
                  </p>
                  <p className="text-xs text-gray-500">Per transaction</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Performance */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Station Performance - {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading analytics...</p>
              </div>
            ) : todaysSales?.salesByStation?.length > 0 ? (
              <div className="space-y-4">
                {todaysSales.salesByStation.map((station, index) => (
                  <div key={station.station_id || station.stationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <h3 className="font-medium text-gray-900">{station.station_name || station.stationName}</h3>
                        <p className="text-sm text-gray-500">
                          {station.entries_count || station.entriesCount} transactions • {station.nozzles_active || station.nozzlesActive} nozzles active
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(station.total_amount || station.totalAmount || 0, { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-sm text-gray-500">
                        Fuels: {(station.fuel_types || station.fuelTypes || []).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sales data available for {selectedDate}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Analysis</TabsTrigger>
            <TabsTrigger value="ranking">Station Ranking</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            {todaysSales?.salesByFuel?.length > 0 && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Fuel Type Performance - {selectedDate}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysSales.salesByFuel.map((fuel) => (
                      <div key={fuel.fuel_type || fuel.fuelType} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 uppercase">{fuel.fuel_type || fuel.fuelType}</h3>
                          <Badge variant="secondary">{fuel.entries_count || fuel.entriesCount} sales</Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(fuel.total_amount || fuel.totalAmount || 0, { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fuel.stations_count || fuel.stationsCount} stations • Avg: ₹{(fuel.average_price || fuel.averagePrice || 0).toFixed(2)}/L
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ranking" className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Station Ranking</CardTitle>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {rankingLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading rankings...</p>
                  </div>
                ) : stationRanking?.length > 0 ? (
                  <div className="space-y-4">
                    {stationRanking.map((station, index) => (
                      <div key={station.id || station.stationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={station.rank <= 3 ? "default" : "outline"} className="w-8 h-8 rounded-full flex items-center justify-center">
                            {station.rank || index + 1}
                          </Badge>
                          <div>
                            <h3 className="font-medium text-gray-900">{station.name || station.stationName}</h3>
                            <p className="text-sm text-gray-500">
                              {station.transactionCount || station.salesCount} transactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(station.totalSales || station.revenue || 0, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatNumber(station.totalVolume || station.volume || 0)} L
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No ranking data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fuel Performance Analytics</CardTitle>
                  <Select value={selectedStationId} onValueChange={setSelectedStationId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedStationId ? (
                  <div className="text-center py-8">
                    <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Please select a station to view fuel performance</p>
                  </div>
                ) : fuelLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading fuel performance...</p>
                  </div>
                ) : fuelPerformance?.data?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Summary</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600">Total Records:</span>
                          <span className="font-medium ml-2">{fuelPerformance.summary?.totalRecords || 0}</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Total Sales:</span>
                          <span className="font-medium ml-2">{formatCurrency(fuelPerformance.summary?.totalSales || 0)}</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Total Profit:</span>
                          <span className="font-medium ml-2">{formatCurrency(fuelPerformance.summary?.totalProfit || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {fuelPerformance.data.slice(0, 10).map((transaction) => (
                          <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{transaction.station_name}</h4>
                                <p className="text-sm text-gray-600 uppercase">{transaction.fuel_type}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(transaction.recorded_at).toLocaleDateString()} - {transaction.payment_method}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(parseFloat(transaction.amount))}</p>
                                <p className="text-sm text-gray-600">{parseFloat(transaction.volume).toFixed(2)} L</p>
                                <p className="text-xs text-gray-500">₹{parseFloat(transaction.fuel_price).toFixed(2)}/L</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No fuel performance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}