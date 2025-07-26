
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Fuel, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';
import { useSalesSummary, useStationMetrics } from '@/hooks/useDashboard';
import { useFuelStore } from '@/store/fuelStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useReconciliationDifferencesSummary } from '@/hooks/useReconciliationDifferencesSummary';
import { useAutoLoader } from '@/hooks/useAutoLoader';

// Dashboard Components
import { SalesSummaryCard } from '@/components/dashboard/SalesSummaryCard';
import { TodaysSalesCard } from '@/components/dashboard/TodaysSalesCard';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { FuelBreakdownChart } from '@/components/dashboard/FuelBreakdownChart';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { TopCreditorsTable } from '@/components/dashboard/TopCreditorsTable';
import { StationMetricsList } from '@/components/dashboard/StationMetricsList';

// Filters
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Use standardized hooks for metrics and sales summary
  const { data: stationMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useStationMetrics();
  // Get current month date range for accurate monthly data
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const monthlyFilters = { ...filters, dateFrom: monthStart, dateTo: monthEnd };
  const { data: salesSummary, isLoading: salesLoading, refetch: refetchSales } = useSalesSummary('monthly', monthlyFilters);
  
  // For lifetime, use a very early date to get all historical data
  const lifetimeFilters = { dateFrom: '2020-01-01', dateTo: new Date().toISOString().split('T')[0] };
  const { data: lifetimeSales, isLoading: lifetimeLoading } = useSalesSummary('all', lifetimeFilters);
  const { data: todaysSales, isLoading: todaysLoading, refetch: refetchTodaysSales } = useTodaysSales();
  const differencesEnabled = !!filters.stationId && !!selectedDate;
  const { data: differencesSummary, isLoading: differencesLoading, error: differencesError } = useReconciliationDifferencesSummary(filters.stationId || '', selectedDate);

  // Safe access to stations from Zustand
  const { stations = [] } = useFuelStore();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSales(),
        refetchMetrics(),
        refetchTodaysSales(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const isLoading = salesLoading || metricsLoading || todaysLoading;
  
  useAutoLoader(salesLoading, 'Loading sales data...');
  useAutoLoader(metricsLoading, 'Loading station metrics...');
  useAutoLoader(todaysLoading, 'Loading today\'s sales...');
  useAutoLoader(lifetimeLoading, 'Loading lifetime data...');
  useAutoLoader(differencesLoading, 'Loading reconciliation data...');

  // Calculate summary stats
  const filteredStations = Array.isArray(stations)
    ? stations.filter(station => !user?.tenantId || station.tenantId === user.tenantId)
    : [];
  const stationsList = filteredStations.length > 0
    ? filteredStations
    : (Array.isArray(stationMetrics) ? stationMetrics : []);
  const totalStations = stationsList.length;
  const activeStations = Array.isArray(stationMetrics) 
    ? stationMetrics.filter(station => station.status === 'active').length 
    : 0;
  
  // Use today's data for key metrics
  const todaysRevenue = todaysSales?.totalAmount || 0;
  const todaysVolume = todaysSales?.totalVolume || 0;
  const todaysEntries = todaysSales?.totalEntries || 0;
  const monthlyRevenue = salesSummary?.totalRevenue || 0;
  const monthlyVolume = salesSummary?.totalVolume || 0;
  const lifetimeRevenue = lifetimeSales?.totalRevenue || 0;
  const lifetimeVolume = lifetimeSales?.totalVolume || 0;

  // Get recent stations for display
  const recentStations = stationsList.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Welcome back, {user?.name}! Here's your business overview.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={() => navigate('/dashboard/fuel-inventory/update')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Update Inventory</span>
                <span className="sm:hidden">Update</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters - Modern Design */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Filters & Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Station</label>
                <SearchableStationSelector
                  value={filters.stationId}
                  onChange={(stationId) => handleFilterChange({ ...filters, stationId })}
                  placeholder="All Stations"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics - Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Today's Revenue */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/25 rounded-3xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatCurrency(todaysRevenue, { useLakhsCrores: true })}
                  </div>
                  <div className="text-blue-100 text-sm">Today's Revenue</div>
                </div>
              </div>
              <div className="text-blue-100 text-xs">
                Monthly: {formatCurrency(monthlyRevenue, { useLakhsCrores: true })} | Lifetime: {formatCurrency(lifetimeRevenue, { useLakhsCrores: true })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Volume */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-lg shadow-green-500/25 rounded-3xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Fuel className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatVolume(todaysVolume, 3, true)}
                  </div>
                  <div className="text-green-100 text-sm">Today's Volume</div>
                </div>
              </div>
              <div className="text-green-100 text-xs">
                Monthly: {formatVolume(monthlyVolume, 3, true)} | Lifetime: {formatVolume(lifetimeVolume, 3, true)}
              </div>
            </CardContent>
          </Card>

          {/* Today's Entries */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg shadow-purple-500/25 rounded-3xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold">{todaysEntries}</div>
                  <div className="text-purple-100 text-sm">Today's Entries</div>
                </div>
              </div>
              <div className="text-purple-100 text-xs">Sales transactions</div>
            </CardContent>
          </Card>

          {/* Active Stations */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 shadow-lg shadow-orange-500/25 rounded-3xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold">{activeStations}</div>
                  <div className="text-orange-100 text-sm">
                    <span className="hidden sm:inline">Active Stations</span>
                    <span className="sm:hidden">Active</span>
                  </div>
                </div>
              </div>
              <div className="text-orange-100 text-xs">Total: {totalStations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Sales - Primary Focus */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Today's Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TodaysSalesCard />
          </CardContent>
        </Card>

        {/* Charts Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
            <PaymentMethodChart filters={filters} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
            <FuelBreakdownChart filters={filters} />
          </div>
        </div>

        {/* Sales Trend - Full Width */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
          <SalesTrendChart filters={filters} />
        </Card>

        {/* Station Metrics - Modern List */}
        <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
          <StationMetricsList />
        </div>

        {/* Recent Stations - Mobile Optimized */}
        {recentStations.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Recent Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentStations.map((station) => (
                  <div key={station.id} className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 truncate text-lg">{station.name}</h3>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Today:</span>
                            <span className="font-semibold text-slate-900">
                              {formatCurrency(station.todaySales || 0, { useLakhsCrores: true })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Monthly:</span>
                            <span className="font-semibold text-slate-900">
                              {formatCurrency(station.monthlySales || 0, { useLakhsCrores: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                        <Badge 
                          variant={station.status === 'active' ? 'default' : 'secondary'}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hidden sm:flex"
                        >
                          {station.status}
                        </Badge>
                        <span className="text-sm text-slate-500 bg-white/50 px-2 py-1 rounded-lg">
                          {station.activePumps || 0}/{station.totalPumps || 0} pumps
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Differences Summary - Conditional */}
        {differencesEnabled && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Reconciliation Differences</CardTitle>
            </CardHeader>
            <CardContent>
              {differencesLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-slate-600">Loading differences...</span>
                </div>
              )}
              {differencesError && (
                <div className="text-red-600 bg-red-50 p-4 rounded-2xl">
                  Error: {differencesError.message}
                </div>
              )}
              {differencesSummary && Array.isArray(differencesSummary) && differencesSummary.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Nozzle</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Expected</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Actual</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {differencesSummary.map((row: any, index: number) => (
                        <tr key={row.nozzleId} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="py-3 px-4">{row.nozzleNumber || row.nozzleId}</td>
                          <td className="py-3 px-4">{row.expectedVolume}</td>
                          <td className="py-3 px-4">{row.actualVolume}</td>
                          <td className={`py-3 px-4 font-semibold ${Math.abs(row.difference) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                            {row.difference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-600">
                  No differences found for selected station and date.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Top Creditors - Bottom */}
        <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 rounded-3xl">
          <TopCreditorsTable />
        </div>
      </div>
    </div>
  );
}
