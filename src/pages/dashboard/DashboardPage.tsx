
/**
 * @file DashboardPage.tsx
 * @description Dashboard page showing key metrics and stats with enhanced analytics
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Fuel, Loader2, Building2, Shield, Package, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useReadings } from '@/hooks/api/useReadings';
import { useSalesSummary } from '@/hooks/useDashboard';
import { usePendingReadings } from '@/hooks/api/usePendingReadings';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { CashDiscrepancyAlert } from '@/components/dashboard/CashDiscrepancyAlert';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch basic data
  const { data: stations = [], isLoading: stationsLoading, refetch: refetchStations } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading, refetch: refetchPumps } = usePumps();
  const { data: fuelPrices = [], isLoading: pricesLoading, refetch: refetchPrices } = useFuelPrices();
  const { data: readings = [], isLoading: readingsLoading, refetch: refetchReadings } = useReadings();

  // Pending reading alerts
  const { data: pendingAlerts = [] } = usePendingReadings();
  
  // Fetch dashboard data
  const { data: salesSummary, isLoading: summaryLoading } = useSalesSummary('monthly');
  
  // Calculate metrics from dashboard data or fallback to basic calculations
  const totalRevenue = salesSummary?.totalRevenue || salesSummary?.totalSales || readings.reduce((sum, reading) => sum + (reading.amount || 0), 0);
  const totalVolume = salesSummary?.totalVolume || readings.reduce((sum, reading) => sum + (reading.volume || 0), 0);
  const activeStations = stations.filter(s => s.status === 'active').length;
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const promises: Promise<any>[] = [refetchStations(), refetchPumps(), refetchPrices(), refetchReadings()];
    await Promise.all(promises);
    setIsRefreshing(false);
  };

  const isLoading =
    stationsLoading ||
    pumpsLoading ||
    pricesLoading ||
    readingsLoading ||
    summaryLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>Dashboard</span>
            {pendingAlerts.length > 0 && (
              <Badge variant="destructive">{pendingAlerts.length}</Badge>
            )}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedMetricsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="This month's earnings"
          gradient="from-emerald-500 to-teal-600"
          trend={{ value: 12.5, isPositive: true }}
        />

        <EnhancedMetricsCard
          title="Fuel Volume"
          value={`${totalVolume.toFixed(3)}L`}
          icon={<Fuel className="h-5 w-5" />}
          description="Total fuel dispensed"
          gradient="from-blue-500 to-cyan-600"
          trend={{ value: 8.3, isPositive: true }}
        />

        <EnhancedMetricsCard
          title="Active Stations"
          value={activeStations}
          icon={<Building2 className="h-5 w-5" />}
          description={`${stations.length} total stations`}
          gradient="from-purple-500 to-indigo-600"
        />

        <EnhancedMetricsCard
          title="Analytics Score"
          value={`${Math.round((activeStations / Math.max(stations.length, 1)) * 100)}%`}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Performance rating"
          gradient="from-orange-500 to-red-600"
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnhancedMetricsCard
          title="Total Transactions"
          value={salesSummary?.salesCount || readings.length}
          icon={<Users className="h-5 w-5" />}
          description="This month"
          gradient="from-pink-500 to-rose-600"
        />
        
        <EnhancedMetricsCard
          title="Total Pumps"
          value={pumps.length}
          icon={<Shield className="h-5 w-5" />}
          description="Across all stations"
          gradient="from-green-500 to-emerald-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Station Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your fuel stations, pumps, and nozzles efficiently.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard/stations">View Stations</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/pumps">Manage Pumps</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Fuel Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Monitor readings, set prices, and track inventory.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                <Link to="/dashboard/readings">New Reading</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/fuel-prices">Set Prices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">Reports & Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate insights and export business reports.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/dashboard/reports">View Reports</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/reconciliation">Reconciliation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Insights */}
      <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{stations.length}</div>
              <div className="text-sm text-muted-foreground">Total Stations</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{pumps.length}</div>
              <div className="text-sm text-muted-foreground">Total Pumps</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{fuelPrices.length}</div>
              <div className="text-sm text-muted-foreground">Fuel Prices Set</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{pendingAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Pending Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cash Discrepancy Alert */}
      <CashDiscrepancyAlert />
    </div>
  );
}
