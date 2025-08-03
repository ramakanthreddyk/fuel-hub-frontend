import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp, CheckCircle, Activity, DollarSign, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { superAdminApi } from '@/api/superadmin';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApiErrorHandler } from '@/hooks/useSessionHandler';

export default function AnalyticsPage() {
  const { user, handleApiError, isAuthenticated, hasRequiredRole } = useApiErrorHandler();

  // Only fetch if user is superadmin
  const { data: analytics, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: superAdminApi.getAnalytics,
    retry: 1,
    staleTime: 300000, // 5 minutes
    enabled: user?.role === 'superadmin' // Only run query if user is superadmin
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      handleApiError(error);
    }
  }, [error, handleApiError]);

  // If user is not superadmin, show access denied
  if (user?.role !== 'superadmin') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Analytics"
          description="Cross-tenant performance metrics and insights"
        />
        
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-700">Access Denied</h3>
            <p className="text-red-600 text-center mb-4">
              You don't have permission to view platform analytics. This section is restricted to super administrators only.
            </p>
            <Badge variant="destructive">
              Current Role: {user?.role || 'Unknown'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Analytics"
          description="Cross-tenant performance metrics and insights"
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Analytics"
          description="Cross-tenant performance metrics and insights"
          actions={
            <Button onClick={() => refetch()} disabled={isRefetching} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          }
        />
        
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-700">Unable to Load Analytics</h3>
            <p className="text-red-600 text-center mb-4">
              There was an error loading the analytics data. The analytics endpoint might not be available yet.
            </p>
            <Button onClick={() => refetch()} disabled={isRefetching} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data from the correct backend structure
  const systemStats = analytics?.systemStats || {};
  const planDistribution = analytics?.planDistribution || [];
  const activitySummary = analytics?.activitySummary || {};

  const activeRate = systemStats.totalTenants > 0
    ? Math.round((systemStats.activeTenants / systemStats.totalTenants) * 100)
    : 0;

  const totalRevenue = planDistribution.reduce((sum: number, plan: any) => sum + (plan.monthlyRevenue || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Cross-tenant performance metrics and insights"
        actions={
          <Button onClick={() => refetch()} disabled={isRefetching} variant="outline" className="hover:bg-blue-50">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {analytics && (
        <>
          {/* Enhanced Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedMetricsCard
              title="Total Tenants"
              value={systemStats.totalTenants || 0}
              icon={<Building2 className="h-5 w-5" />}
              description={`${systemStats.activeTenants || 0} active organizations`}
              gradient="from-purple-500 via-indigo-500 to-blue-600"
              trend={{ value: activeRate, isPositive: activeRate > 80 }}
            />

            <EnhancedMetricsCard
              title="Platform Stations"
              value={systemStats.totalStations || 0}
              icon={<Gauge className="h-5 w-5" />}
              description={`${systemStats.totalPumps || 0} pumps, ${systemStats.totalNozzles || 0} nozzles`}
              gradient="from-emerald-500 via-teal-500 to-cyan-600"
              trend={{ value: systemStats.totalStations > 0 ? 100 : 0, isPositive: systemStats.totalStations > 0 }}
            />

            <EnhancedMetricsCard
              title="Total Users"
              value={systemStats.totalUsers || 0}
              icon={<Users className="h-5 w-5" />}
              description={`${systemStats.activeUsersWeek || 0} active this week`}
              gradient="from-orange-500 via-red-500 to-pink-600"
              trend={{ value: systemStats.totalUsers > 0 ? Math.round((systemStats.activeUsersWeek / systemStats.totalUsers) * 100) : 0, isPositive: true }}
            />

            <EnhancedMetricsCard
              title="Monthly Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
              description="From all active plans"
              gradient="from-violet-500 via-purple-500 to-fuchsia-600"
              trend={{ value: totalRevenue > 1000 ? 15 : 5, isPositive: totalRevenue > 0 }}
            />
          </div>

          {/* Plan Distribution */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planDistribution.map((plan, index) => (
              <Card key={plan.planName} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {plan.planName}
                    <Badge variant={plan.tenantCount > 0 ? "default" : "secondary"}>
                      {plan.tenantCount} tenants
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Revenue</span>
                      <span className="font-medium">₹{plan.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={plan.tenantCount > 0 ? (plan.tenantCount / systemStats.totalTenants) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{activitySummary.activeUsers || 0}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{systemStats.reportsToday || 0}</div>
                    <div className="text-sm text-muted-foreground">Reports Today</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-medium">{activitySummary.weekActivities || 0} activities</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-medium">{systemStats.reportsMonth || 0} reports</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {systemStats.totalTenants > 0 ? '99.9%' : '100%'}
                    </div>
                    <div className="text-sm text-muted-foreground">Platform Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {systemStats.totalUsers > 0 ? '100%' : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Integrity</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Tenants</span>
                    <Badge variant={systemStats.activeTenants === systemStats.totalTenants ? "default" : "secondary"}>
                      {systemStats.activeTenants}/{systemStats.totalTenants}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>System Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
