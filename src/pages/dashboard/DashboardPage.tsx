/**
 * Modern Dashboard Page - Real API Integration Status
 * 
 * ✅ WORKING WITH REAL DATA:
 * - Today's sales summary (/todays-sales/summary)
 * - Payment method breakdown (from today's sales)
 * - Fuel type breakdown (from today's sales)
 * - Station list (/stations)
 * - Basic creditors list (/creditors)
 * 
 * ⚠️  PARTIALLY WORKING (needs API enhancement):
 * - Station metrics (missing monthly sales per station)
 * - Station pump counts (relationship might need population)
 * 
 * ❌ MISSING API ENDPOINTS NEEDED:
 * - Daily sales trend: Need /sales/analytics?groupBy=date or /dashboard/sales-trend
 * - Monthly sales per station: Need /reports/sales with station grouping
 * - Historical data for growth calculations
 * - Station performance metrics over time
 * 
 * 💡 RECOMMENDED API ADDITIONS:
 * 1. /dashboard/metrics - Combined dashboard metrics
 * 2. /sales/analytics?groupBy=date&days=7 - Daily trend data
 * 3. /stations/{id}/metrics?period=month - Station-specific metrics
 * 4. Enhanced /reports/sales with breakdown options
 */

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
import { useDashboardStore } from '@/store/dashboardStore';

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
  const { selectedDate, setSelectedDate } = useDashboardStore();

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
  const { data: todaysSales, isLoading: todaysLoading, refetch: refetchTodaysSales } = useTodaysSales(selectedDate || undefined);
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
  
  // Loading states are now handled by individual hooks with toast notifications

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
      {/* Redesigned Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
            {/* Left side - Logo and title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base truncate">
                  <span className="sm:hidden">Welcome, {user?.name?.split(' ')[0]}</span>
                  <span className="hidden sm:inline">Welcome back, {user?.name}</span>
                </p>
              </div>
            </div>
            
            {/* Right side - Action buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-200 px-2 sm:px-3"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''} sm:mr-2`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button
                onClick={() => navigate('/dashboard/fuel-inventory/update')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-2 sm:px-3"
                size="sm"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Update Inventory</span>
                <span className="sm:hidden">Update</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Redesigned Compact Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Activity className="h-4 w-4 text-gray-600" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Station</label>
              <SearchableStationSelector
                value={filters.stationId}
                onChange={(stationId) => handleFilterChange({ ...filters, stationId })}
                placeholder="All Stations"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={e => setSelectedDate(e.target.value || null)}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                {selectedDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="px-2 sm:px-3 py-2 sm:py-2.5 text-gray-600 hover:text-gray-800 text-xs sm:text-sm"
                  >
                    Today
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Redesigned Compact Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Total Sales (Lifetime) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {lifetimeLoading ? '...' : formatCurrency(lifetimeRevenue, { useLakhsCrores: true })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="sm:hidden">Total</span>
                    <span className="hidden sm:inline">Total Sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Volume (Lifetime) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl sm:rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Fuel className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {lifetimeLoading ? '...' : formatVolume(lifetimeVolume, 0, true)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="sm:hidden">Volume</span>
                    <span className="hidden sm:inline">Total Volume</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl sm:rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {salesLoading ? '...' : formatCurrency(monthlyRevenue, { useLakhsCrores: true })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="sm:hidden">Monthly</span>
                    <span className="hidden sm:inline">This Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Stations */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl sm:rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{activeStations}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="sm:hidden">Active</span>
                    <span className="hidden sm:inline">Active Stations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview - Compact for Mobile */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  <span className="sm:hidden">{selectedDate ? 'Sales' : "Today's Sales"}</span>
                  <span className="hidden sm:inline">
                    {selectedDate ? `Sales for ${new Date(selectedDate).toLocaleDateString()}` : "Today's Sales Overview"}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  <span className="sm:hidden">Performance</span>
                  <span className="hidden sm:inline">
                    {selectedDate ? 'Historical sales performance' : 'Real-time sales performance'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <ModernTodaysSalesCard date={selectedDate} />
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernPaymentMethodChart filters={filters} />
        </div>

        {/* Fuel Breakdown Chart - Full Width */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernFuelBreakdownChart filters={filters} date={selectedDate} />
        </div>

        {/* Sales Trend - Modern */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernSalesTrendChart filters={filters} />
        </div>

        {/* Station Metrics - Modern */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernStationMetricsList />
        </div>

        {/* Recent Stations - Modern Mobile Optimized */}
        {recentStations.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Recent Stations</h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Latest station activity</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentStations.map((station) => (
                  <div key={station.id} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{station.name}</h3>
                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-xxs sm:text-xs text-gray-500">{station.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xxs sm:text-sm text-gray-600">Last Activity:</span>
                            <span className="text-xxs sm:text-xs text-gray-500">
                              {station.lastActivity ? 
                                new Date(station.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                'No activity'
                              }
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xxs sm:text-sm text-gray-600">Status:</span>
                            <span className={`text-xxs sm:text-xs font-medium ${
                              station.status === 'active' ? 'text-green-600' : 
                              station.status === 'maintenance' ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {station.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0 ml-2 sm:ml-4">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-gray-900">
                            {formatCurrency(station.todaySales || 0, { useLakhsCrores: true })}
                          </div>
                          <div className="text-xxs sm:text-xs text-gray-500">today's sales</div>
                        </div>
                        <div className="bg-gray-100 rounded-md sm:rounded-lg px-1 sm:px-2 py-0.5">
                          <span className="text-xxs sm:text-xs font-medium text-gray-700">
                            {station.activePumps || 0}/{station.totalPumps || 0} pumps
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modern Top Creditors */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
          <ModernTopCreditorsTable />
        </div>
      </div>
    </div>
  );
}
