import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Fuel, AlertTriangle, CheckCircle, XCircle, Plus } from 'lucide-react';
import { formatCurrency, formatVolume, formatSafeNumber } from '@/utils/formatters';
import { useSalesSummary, useStationMetrics } from '@/hooks/useDashboard';
import { useFuelStore } from '@/store/fuelStore';
import { shallow } from 'zustand/shallow';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useReconciliationDifferencesSummary } from '@/hooks/useReconciliationDifferencesSummary';

// Dashboard Components
import { SalesSummaryCard } from '@/components/dashboard/SalesSummaryCard';
import { TodaysSalesCard } from '@/components/dashboard/TodaysSalesCard';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { FuelBreakdownChart } from '@/components/dashboard/FuelBreakdownChart';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { TopCreditorsTable } from '@/components/dashboard/TopCreditorsTable';
import { StationMetricsCard } from '@/components/dashboard/StationMetricsCard';
import { StationMetricsList } from '@/components/dashboard/StationMetricsList';
import { ApiDiagnosticPanel } from '@/components/dashboard/ApiDiagnosticPanel';

// Filters
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface Station {
  id: string;
  name: string;
  todaySales?: number;
  monthlySales?: number;
  status?: string;
  activePumps?: number;
  totalPumps?: number;
  tenantId?: string; // Added for tenant filtering
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Use standardized hooks for metrics and sales summary
  const { data: stationMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useStationMetrics();
  const { data: salesSummary, isLoading: salesLoading, refetch: refetchSales } = useSalesSummary('monthly', filters);
  const { data: todaysSales, isLoading: todaysLoading, refetch: refetchTodaysSales } = useTodaysSales();
  const differencesEnabled = !!filters.stationId && !!selectedDate;
  const { data: differencesSummary, isLoading: differencesLoading, error: differencesError } = useReconciliationDifferencesSummary(filters.stationId || '', selectedDate);

  // Safe access to stations and nozzles from Zustand
  const { stations = [], nozzles = {}, resetSelections } = useFuelStore();

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

  // Calculate summary stats - prioritize today's data
  // Use Zustand stations if available, else fallback to metrics
  // Fix: Only show stations for the current tenant/user
  // If backend filtering fails, filter stations in frontend as a fallback
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
  
  // Use today's data for key metrics, fallback to monthly summary
  const todaysRevenue = todaysSales?.totalAmount || 0;
  const todaysVolume = todaysSales?.totalVolume || 0;
  const todaysEntries = todaysSales?.totalEntries || 0;
  const monthlyRevenue = salesSummary?.totalRevenue || 0;
  const monthlyVolume = salesSummary?.totalVolume || 0;

  // Get recent stations for display
  const recentStations = stationsList.slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back, {user?.name}! Here's your business overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchableStationSelector
                value={filters.stationId}
                onChange={(stationId) => handleFilterChange({ ...filters, stationId })}
                placeholder="All Stations"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Select Date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard/fuel-inventory/update')}
          >
            <Fuel className="mr-2 h-4 w-4" />
            Update Inventory
          </Button>
        </div>
        
        {/* Key Metrics - Today's Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(todaysRevenue, { useLakhsCrores: true })}</p>
                  <p className="text-xs text-slate-500">Monthly: {formatCurrency(monthlyRevenue, { useLakhsCrores: true })}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Today's Volume</p>
                  <p className="text-2xl font-bold text-slate-900">{formatVolume(todaysVolume, 3, true)}</p>
                  <p className="text-xs text-slate-500">Monthly: {formatVolume(monthlyVolume, 3, true)}</p>
                </div>
                <Fuel className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Today's Entries</p>
                  <p className="text-2xl font-bold text-slate-900">{todaysEntries}</p>
                  <p className="text-xs text-slate-500">Sales transactions</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Active Stations</p>
                  <p className="text-2xl font-bold text-slate-900">{activeStations}</p>
                  <p className="text-xs text-slate-500">Total: {totalStations}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Sales - Primary Focus */}
        <div className="grid grid-cols-1 gap-6">
          <TodaysSalesCard />
        </div>

        {/* Historical Sales Summary */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Monthly Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesSummaryCard filters={filters} />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentMethodChart filters={filters} />
          <FuelBreakdownChart filters={filters} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SalesTrendChart filters={filters} />
        </div>

        {/* Station Metrics - Full Width */}
        <div className="w-full">
          <StationMetricsList />
        </div>

        {/* Recent Stations - Two Cards Per Row */}
        {recentStations.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Recent Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentStations.map((station) => (
                  <div key={station.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 truncate">{station.name}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Today:</span> {formatCurrency(station.todaySales || 0, { useLakhsCrores: true })}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Monthly:</span> {formatCurrency(station.monthlySales || 0, { useLakhsCrores: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                        {station.status}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {station.activePumps || 0}/{station.totalPumps || 0} pumps
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Differences Summary Section */}
        {differencesEnabled && (
          <Card className="bg-white border-slate-200 shadow-sm mt-4">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Reconciliation Differences Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {differencesLoading && <div>Loading differences summary...</div>}
              {differencesError && <div className="text-red-600">Error: {differencesError.message}</div>}
              {differencesSummary && Array.isArray(differencesSummary) && differencesSummary.length > 0 ? (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Nozzle</th>
                      <th className="text-left">Expected</th>
                      <th className="text-left">Actual</th>
                      <th className="text-left">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {differencesSummary.map((row: any) => (
                      <tr key={row.nozzleId}>
                        <td>{row.nozzleNumber || row.nozzleId}</td>
                        <td>{row.expectedVolume}</td>
                        <td>{row.actualVolume}</td>
                        <td className={Math.abs(row.difference) > 0.01 ? 'text-red-600' : 'text-green-600'}>{row.difference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No differences found for selected station and date.</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Top Creditors - Moved to Bottom */}
        <div className="w-full">
          <TopCreditorsTable />
        </div>
        
        {/* API Diagnostics Panel - Temporarily disabled */}
      </div>
    </div>
  );
}

// Helper: Check if error is day finalized
function isDayFinalizedError(error: any) {
  return error?.response?.data?.message === 'Day already finalized for this station.';
}

// Example usage in reconciliation/cash report creation
// In your mutation error handler (e.g., useCreateReading, useCreateCashReport):
// onError: (error: any) => {
//   if (isDayFinalizedError(error)) {
//     toast({
//       title: 'Day Finalized',
//       description: 'No further entries can be added for this day and station.',
//       variant: 'destructive',
//     });
//   } else {
//     // ...existing error handling...
//   }
// }
