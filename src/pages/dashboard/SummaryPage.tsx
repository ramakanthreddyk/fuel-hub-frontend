
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Fuel, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { useStationMetrics } from '@/hooks/api/useDashboard';
import { useAuth } from '@/contexts/AuthContext';

// Dashboard Components
import { SalesSummaryCard } from '@/components/dashboard/SalesSummaryCard';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { FuelBreakdownChart } from '@/components/dashboard/FuelBreakdownChart';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { ProfitMetricsCard } from '@/components/dashboard/ProfitMetricsCard';
import { TopCreditorsTable } from '@/components/dashboard/TopCreditorsTable';
import { StationMetricsCard } from '@/components/dashboard/StationMetricsCard';
import { StationMetricsList } from '@/components/dashboard/StationMetricsList';

// Filters
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function SummaryPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API hooks
  const { data: salesSummary, isLoading: salesLoading, refetch: refetchSales } = useSalesSummary('monthly', filters);
  const { data: stationMetrics = [], isLoading: metricsLoading, refetch: refetchMetrics } = useStationMetrics();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSales(),
        refetchMetrics(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const isLoading = salesLoading || metricsLoading;

  // Calculate summary stats
  const totalStations = Array.isArray(stationMetrics) ? stationMetrics.length : 0;
  const activeStations = Array.isArray(stationMetrics) 
    ? stationMetrics.filter(station => station.status === 'active').length 
    : 0;
  const totalRevenue = salesSummary?.totalRevenue || 0;
  const totalVolume = salesSummary?.totalVolume || 0;

  // Get recent stations for display
  const recentStations = Array.isArray(stationMetrics) ? stationMetrics.slice(0, 5) : [];

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableStationSelector
              value={filters.stationId}
              onChange={(stationId) => handleFilterChange({ ...filters, stationId })}
              placeholder="All Stations"
            />
            {/* Add date range pickers here if needed */}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Volume</p>
                <p className="text-2xl font-bold text-green-700">{totalVolume.toLocaleString()}L</p>
              </div>
              <Fuel className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Stations</p>
                <p className="text-2xl font-bold text-purple-700">{activeStations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Stations</p>
                <p className="text-2xl font-bold text-orange-700">{totalStations}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="min-w-0">
          <SalesSummaryCard filters={filters} />
        </div>
        <div className="min-w-0">
          <ProfitMetricsCard filters={filters} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="min-w-0">
          <PaymentMethodChart filters={filters} />
        </div>
        <div className="min-w-0">
          <FuelBreakdownChart filters={filters} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full min-w-0">
        <div className="min-w-0">
          <SalesTrendChart filters={filters} />
        </div>
      </div>

      {/* Station Metrics - Full Width */}
      <div className="w-full min-w-0">
        <StationMetricsList />
      </div>

      {/* Recent Stations - Two Cards Per Row */}
      {recentStations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentStations.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{station.name}</h3>
                    <div className="space-y-1 mt-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Today:</span> ₹{station.todaySales?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Monthly:</span> ₹{station.monthlySales?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                    <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                      {station.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {station.activePumps || 0}/{station.totalPumps || 0} pumps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Creditors - Moved to Bottom */}
      <div className="w-full min-w-0">
        <TopCreditorsTable />
      </div>
    </div>
  );
}
