/**
 * @file pages/dashboard/AnalyticsPage.tsx
 * @description Enhanced analytics dashboard with comprehensive insights, mobile optimization, and smart features
 */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, TrendingUp, Calendar, DollarSign, Clock, Fuel, Zap, Target } from "lucide-react";
import { useTodaysSales } from "@/hooks/api/useTodaysSales";
import { useStationRanking, useHourlySales, useFuelPerformance } from "@/hooks/useAnalytics";
import { useStations } from "@/hooks/api/useStations";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAutoLoader } from "@/hooks/useAutoLoader";
import { SmartAnalyticsDashboard } from "@/components/analytics/SmartAnalyticsDashboard";
import { useMobileFormatters, getResponsiveTextSize, getResponsivePadding } from "@/utils/mobileFormatters";
import { Station } from "@/shared/types/station";
import { useAuth } from '@/contexts/AuthContext';

export default function AnalyticsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const [viewMode, setViewMode] = useState<'smart' | 'detailed'>('smart');
  
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const { user } = useAuth();

  // Only load analytics hooks after user and stations are loaded
  const canLoadAnalytics = !!user && (user.role === 'owner' || user.role === 'manager') && !stationsLoading && stations.length > 0;

  // Only call analytics hooks when canLoadAnalytics is true
  const {
    data: todaysSales,
    isLoading,
    refetch
  } = canLoadAnalytics ? useTodaysSales(selectedDate) : { data: undefined, isLoading: false, refetch: async () => {} };

  const {
    data: stationRanking,
    isLoading: rankingLoading
  } = canLoadAnalytics ? useStationRanking(selectedPeriod) : { data: undefined, isLoading: false };

  const {
    data: fuelPerformance,
    isLoading: fuelLoading
  } = canLoadAnalytics ? useFuelPerformance((stations as Station[])[0].id) : { data: undefined, isLoading: false };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isMobile, formatCurrency: formatCurrencyMobile } = useMobileFormatters();

  useAutoLoader(isLoading, 'Loading analytics...');
  useAutoLoader(rankingLoading, 'Loading station rankings...');
  useAutoLoader(fuelLoading, 'Loading fuel performance...');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (!canLoadAnalytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user and stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50/50 ${getResponsivePadding('base')} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-w-0">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 lg:p-6 min-w-0">
          <div className="flex flex-col space-y-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`${getResponsiveTextSize('2xl')} font-bold text-gray-900 truncate`}>
                  {isMobile ? 'Analytics' : 'Analytics Dashboard'}
                </h1>
                <p className={`${getResponsiveTextSize('sm')} text-gray-600 truncate`}>
                  {isMobile ? 'Business insights' : 'Real-time sales performance and business insights'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'smart' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('smart')}
                  className={`${isMobile ? 'text-xs px-2' : 'text-sm'} ${viewMode === 'smart' ? 'bg-blue-600 text-white' : ''}`}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {isMobile ? 'Smart' : 'Smart View'}
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                  className={`${isMobile ? 'text-xs px-2' : 'text-sm'} ${viewMode === 'detailed' ? 'bg-blue-600 text-white' : ''}`}
                >
                  <Target className="h-3 w-3 mr-1" />
                  {isMobile ? 'Detail' : 'Detailed View'}
                </Button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`${isMobile ? 'text-sm px-2 py-1' : 'px-3 py-2'} border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className={isMobile ? 'px-2' : ''}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Dashboard Integration */}
        {viewMode === 'smart' ? (
          <SmartAnalyticsDashboard />
        ) : (
          <>


            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className={`${getResponsivePadding('base')}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className={`${getResponsiveTextSize('sm')} font-medium text-gray-600 truncate`}>Total Sales</p>
                      <p className={`${getResponsiveTextSize('xl')} font-bold text-gray-900`}>
                        {formatNumber(todaysSales?.totalEntries || 0)}
                      </p>
                      <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                        {isMobile ? selectedDate.split('-').reverse().join('/') : `Transactions on ${selectedDate}`}
                      </p>
                    </div>
                    <TrendingUp className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-blue-600 flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardContent className={`${getResponsivePadding('base')}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className={`${getResponsiveTextSize('sm')} font-medium text-gray-600 truncate`}>
                        Total Revenue
                      </p>
                      <p className={`${getResponsiveTextSize('xl')} font-bold text-gray-900`}>
                        {isMobile
                          ? formatCurrencyMobile(todaysSales?.totalAmount || 0)
                          : formatCurrency(todaysSales?.totalAmount || 0, { maximumFractionDigits: 0 })
                        }
                      </p>
                      <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                        {isMobile ? selectedDate.split('-').reverse().join('/') : `Revenue on ${selectedDate}`}
                      </p>
                    </div>
                    <DollarSign className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-green-600 flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardContent className={`${getResponsivePadding('base')}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className={`${getResponsiveTextSize('sm')} font-medium text-gray-600 truncate`}>
                        Active Stations
                      </p>
                      <p className={`${getResponsiveTextSize('xl')} font-bold text-gray-900`}>
                        {todaysSales?.salesByStation?.length || 0}
                      </p>
                      <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                        {isMobile ? 'With sales' : 'Stations with sales'}
                      </p>
                    </div>
                    <BarChart3 className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-purple-600 flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardContent className={`${getResponsivePadding('base')}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className={`${getResponsiveTextSize('sm')} font-medium text-gray-600 truncate`}>
                        {isMobile ? 'Avg. Sale' : 'Avg. Transaction'}
                      </p>
                      <p className={`${getResponsiveTextSize('xl')} font-bold text-gray-900`}>
                        {todaysSales?.totalEntries > 0
                          ? (isMobile
                              ? formatCurrencyMobile((todaysSales?.totalAmount || 0) / todaysSales.totalEntries)
                              : formatCurrency((todaysSales?.totalAmount || 0) / todaysSales.totalEntries, { maximumFractionDigits: 0 })
                            )
                          : '₹0'}
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
                <CardTitle className={`${getResponsiveTextSize('lg')} truncate`}>
                  {isMobile ? `Stations - ${selectedDate.split('-').slice(1).join('/')}` : `Station Performance - ${selectedDate}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading analytics...</p>
                  </div>
                ) : todaysSales?.salesByStation?.length > 0 ? (
                  <div className="space-y-4">
                    {todaysSales.salesByStation.map((station: any, index) => (
                      <div key={station.stationId || index} className={`flex items-center justify-between ${getResponsivePadding('sm')} bg-gray-50 rounded-lg`}>
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <Badge variant="outline" className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8'} rounded-full flex items-center justify-center flex-shrink-0`}>
                            {index + 1}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <h3 className={`${getResponsiveTextSize('sm')} font-medium text-gray-900 truncate`}>
                              {station.stationName || `Station ${index + 1}`}
                            </h3>
                            <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                              {station.entriesCount || 0} {isMobile ? 'sales' : 'transactions'} • {station.nozzlesActive || 0} {isMobile ? 'active' : 'nozzles active'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className={`${getResponsiveTextSize('sm')} font-bold text-gray-900`}>
                            {isMobile
                              ? formatCurrencyMobile(station.totalAmount || 0)
                              : formatCurrency(station.totalAmount || 0, { maximumFractionDigits: 0 })
                            }
                          </p>
                          <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                            {isMobile
                              ? `${(station.fuelTypes || []).length} fuels`
                              : `Fuels: ${(station.fuelTypes || []).join(', ')}`
                            }
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
              <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3'}`}>
                <TabsTrigger value="daily" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
                  {isMobile ? 'Daily' : 'Daily Analysis'}
                </TabsTrigger>
                <TabsTrigger value="ranking" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
                  {isMobile ? 'Ranking' : 'Station Ranking'}
                </TabsTrigger>
                <TabsTrigger value="fuel" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
                  {isMobile ? 'Fuel' : 'Fuel Performance'}
                </TabsTrigger>
              </TabsList>

              {/* Daily Analysis */}
              <TabsContent value="daily" className="space-y-6">
                {todaysSales?.salesByFuel?.length > 0 && (
                  <Card className="bg-white border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className={`${getResponsiveTextSize('lg')} truncate`}>
                        {isMobile ? `Fuel - ${selectedDate.split('-').slice(1).join('/')}` : `Fuel Type Performance - ${selectedDate}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todaysSales.salesByFuel.map((fuel: any) => (
                          <div key={fuel.fuelType} className={`${getResponsivePadding('sm')} bg-gray-50 rounded-lg`}>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`${getResponsiveTextSize('sm')} font-medium text-gray-900 uppercase truncate`}>
                                {fuel.fuelType}
                              </h3>
                              <Badge variant="secondary" className={`${isMobile ? 'text-xs' : 'text-sm'} flex-shrink-0 ml-2`}>
                                {fuel.entriesCount} {isMobile ? 'sales' : 'sales'}
                              </Badge>
                            </div>
                            <p className={`${getResponsiveTextSize('xl')} font-bold text-gray-900`}>
                              {isMobile
                                ? formatCurrencyMobile(fuel.totalAmount || 0)
                                : formatCurrency(fuel.totalAmount || 0, { maximumFractionDigits: 0 })
                              }
                            </p>
                            <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                              {isMobile
                                ? `${fuel.stationsCount} stations • ₹${(fuel.averagePrice || 0).toFixed(1)}/L`
                                : `${fuel.stationsCount} stations • Avg: ₹${(fuel.averagePrice || 0).toFixed(2)}/L`
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Station Ranking */}
              <TabsContent value="ranking" className="space-y-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
                      <CardTitle className={`${getResponsiveTextSize('lg')} truncate`}>
                        {isMobile ? 'Rankings' : 'Station Ranking'}
                      </CardTitle>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
                        className={`${isMobile ? 'w-full' : ''} px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white`}
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
                          <div key={station.stationId} className={`flex items-center justify-between ${getResponsivePadding('base')} bg-gray-50 rounded-lg`}>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <Badge
                                variant={station.rank <= 3 ? "default" : "outline"}
                                className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8'} rounded-full flex items-center justify-center flex-shrink-0`}
                              >
                                {station.rank || index + 1}
                              </Badge>
                              <div className="min-w-0 flex-1">
                                <h3 className={`${getResponsiveTextSize('sm')} font-medium text-gray-900 truncate`}>
                                  {station.stationName}
                                </h3>
                                <p className={`${getResponsiveTextSize('xs')} text-gray-500`}>
                                  Rank #{station.rank} {isMobile ? 'station' : 'in rankings'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <p className={`${getResponsiveTextSize('sm')} font-bold text-gray-900`}>
                                {isMobile
                                  ? formatCurrencyMobile(station.sales || 0)
                                  : formatCurrency(station.sales || 0, { maximumFractionDigits: 0 })
                                }
                              </p>
                              <p className={`${getResponsiveTextSize('xs')} text-gray-500`}>
                                {formatNumber(station.volume || 0)} L
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

              {/* Fuel Performance */}
              <TabsContent value="fuel" className="space-y-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className={`${getResponsiveTextSize('lg')} truncate`}>
                      {isMobile ? 'Fuel Analytics' : 'Fuel Performance Analytics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fuelLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading fuel performance...</p>
                      </div>
                    ) : fuelPerformance && fuelPerformance.length > 0 ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <h3 className={`${getResponsiveTextSize('sm')} font-medium text-blue-900 mb-2 truncate`}>
                            {isMobile ? 'Summary' : 'Fuel Performance Summary'}
                          </h3>
                          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-4'} text-sm`}>
                            <div className="flex justify-between sm:block">
                              <span className="text-blue-600">Total Records:</span>
                              <span className="font-medium sm:ml-2">{fuelPerformance.length}</span>
                            </div>
                            <div className="flex justify-between sm:block">
                              <span className="text-blue-600">Fuel Types:</span>
                              <span className="font-medium sm:ml-2">
                                {new Set(fuelPerformance.map((f: any) => f.fuelType)).size}
                              </span>
                            </div>
                            <div className="flex justify-between sm:block">
                              <span className="text-blue-600">Total Volume:</span>
                              <span className="font-medium sm:ml-2">
                                {fuelPerformance.reduce((sum: number, f: any) => sum + (f.volume || 0), 0).toFixed(1)}L
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="space-y-2">
                            {fuelPerformance.map((fuelData: any) => (
                              <div key={fuelData.stationId && fuelData.fuelType ? `${fuelData.stationId}-${fuelData.fuelType}` : Math.random().toString()} className={`${getResponsivePadding('sm')} bg-gray-50 rounded-lg`}>
                                <div className="flex justify-between items-start">
                                  <div className="min-w-0 flex-1">
                                    <h4 className={`${getResponsiveTextSize('sm')} font-medium text-gray-900 truncate`}>
                                      {fuelData.stationName || 'Unknown Station'}
                                    </h4>
                                    <p className={`${getResponsiveTextSize('xs')} text-gray-600 uppercase truncate`}>
                                      {fuelData.fuelType}
                                    </p>
                                    <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                                      {isMobile
                                        ? `${fuelData.salesCount} sales • ${fuelData.growth > 0 ? '+' : ''}${fuelData.growth.toFixed(1)}% growth`
                                        : `${fuelData.salesCount} transactions • Growth: ${fuelData.growth > 0 ? '+' : ''}${fuelData.growth.toFixed(1)}%`
                                      }
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0 ml-2">
                                    <p className={`${getResponsiveTextSize('sm')} font-medium text-gray-900`}>
                                      {isMobile
                                        ? formatCurrencyMobile(fuelData.revenue || 0)
                                        : formatCurrency(fuelData.revenue || 0)
                                      }
                                    </p>
                                    <p className={`${getResponsiveTextSize('xs')} text-gray-600`}>
                                      {(fuelData.volume || 0).toFixed(isMobile ? 1 : 2)} L
                                    </p>
                                    <p className={`${getResponsiveTextSize('xs')} text-gray-500`}>
                                      ₹{(fuelData.averagePrice || 0).toFixed(isMobile ? 1 : 2)}/L
                                    </p>
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
          </>
        )}
      </div>
    </div>
  );
}
