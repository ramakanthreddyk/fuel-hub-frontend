
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Fuel, CheckCircle, Plus, BarChart3, PieChart, Activity, Clock } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';
import { useSalesSummary, useStationMetrics } from '@/hooks/useDashboard';
import { useFuelStore } from '@/store/fuelStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useReconciliationDifferencesSummary } from '@/hooks/useReconciliationDifferencesSummary';
import { useAutoLoader } from '@/hooks/useAutoLoader';

// Modern Dashboard Components
import { ModernSalesSummaryCard } from '@/components/dashboard/ModernSalesSummaryCard';
import { ModernTodaysSalesCard } from '@/components/dashboard/ModernTodaysSalesCard';
import { ModernPaymentMethodChart } from '@/components/dashboard/ModernPaymentMethodChart';
import { ModernFuelBreakdownChart } from '@/components/dashboard/ModernFuelBreakdownChart';
import { ModernSalesTrendChart } from '@/components/dashboard/ModernSalesTrendChart';
import { ModernTopCreditorsTable } from '@/components/dashboard/ModernTopCreditorsTable';
import { ModernStationMetricsList } from '@/components/dashboard/ModernStationMetricsList';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Ultra Modern Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-200"
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
        {/* Modern Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Activity className="h-4 w-4 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Filters & Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Station</label>
              <SearchableStationSelector
                value={filters.stationId}
                onChange={(stationId) => handleFilterChange({ ...filters, stationId })}
                placeholder="All Stations"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Modern Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Revenue */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(todaysRevenue, { useLakhsCrores: true })}
                  </div>
                  <div className="text-sm text-gray-600">Today's Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                </div>
                <span className="text-xs text-gray-500">+12%</span>
              </div>
            </div>
          </div>

          {/* Today's Volume */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Fuel className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatVolume(todaysVolume, 3, true)}
                  </div>
                  <div className="text-sm text-gray-600">Today's Volume</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 bg-green-500 rounded-full w-2/3"></div>
                </div>
                <span className="text-xs text-gray-500">+8%</span>
              </div>
            </div>
          </div>

          {/* Today's Entries */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{todaysEntries}</div>
                  <div className="text-sm text-gray-600">Today's Entries</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 bg-purple-500 rounded-full w-4/5"></div>
                </div>
                <span className="text-xs text-gray-500">+15%</span>
              </div>
            </div>
          </div>

          {/* Active Stations */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{activeStations}</div>
                  <div className="text-sm text-gray-600">
                    <span className="hidden sm:inline">Active Stations</span>
                    <span className="sm:hidden">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 bg-orange-500 rounded-full w-full"></div>
                </div>
                <span className="text-xs text-gray-500">{totalStations} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Sales Overview - Modern */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Today's Sales Overview</h2>
                <p className="text-sm text-gray-600">Real-time sales performance</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ModernTodaysSalesCard />
          </div>
        </div>

        {/* Modern Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
            <ModernPaymentMethodChart filters={filters} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
            <ModernFuelBreakdownChart filters={filters} />
          </div>
        </div>

        {/* Sales Trend - Modern */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernSalesTrendChart filters={filters} />
        </div>

        {/* Station Metrics - Modern */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernStationMetricsList />
        </div>

        {/* Recent Stations - Modern Mobile Optimized */}
        {recentStations.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Stations</h2>
                  <p className="text-sm text-gray-600">Latest station activity</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentStations.map((station) => (
                  <div key={station.id} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Fuel className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{station.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-xs text-gray-500">{station.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Today:</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(station.todaySales || 0, { useLakhsCrores: true })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Monthly:</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(station.monthlySales || 0, { useLakhsCrores: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                        <div className="bg-gray-100 rounded-lg px-3 py-1">
                          <span className="text-sm font-medium text-gray-700">
                            {station.activePumps || 0}/{station.totalPumps || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">pumps</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modern Top Creditors */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernTopCreditorsTable />
        </div>
      </div>
    </div>
  );
}
