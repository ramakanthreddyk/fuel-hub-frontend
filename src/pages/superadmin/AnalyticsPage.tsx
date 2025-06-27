
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp, CheckCircle } from 'lucide-react';
import { superadminApi, SuperAdminSummary } from '@/api/superadmin';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: superadminApi.getSummary
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">Cross-tenant performance metrics</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">Cross-tenant performance metrics</p>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          Unable to load analytics data. Please try again later.
        </div>
      </div>
    );
  }

  const activeRate = analytics.totalTenants > 0 
    ? Math.round((analytics.activeTenants / analytics.totalTenants) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground">Cross-tenant performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <EnhancedMetricsCard
          title="Total Tenants"
          value={analytics.totalTenants}
          icon={<Building2 className="h-4 w-4" />}
          description={`${analytics.activeTenants} active`}
          gradient="from-purple-500 to-indigo-600"
        />

        <EnhancedMetricsCard
          title="Total Stations"
          value={analytics.totalStations}
          icon={<Gauge className="h-4 w-4" />}
          gradient="from-blue-500 to-cyan-600"
        />

        <EnhancedMetricsCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={<Users className="h-4 w-4" />}
          description="All tenant users"
          gradient="from-green-500 to-emerald-600"
        />

        <EnhancedMetricsCard
          title="Monthly Signups"
          value={analytics.signupsThisMonth}
          icon={<TrendingUp className="h-4 w-4" />}
          description="New tenants this month"
          gradient="from-orange-500 to-red-600"
        />

        <EnhancedMetricsCard
          title="Active Rate"
          value={`${activeRate}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Tenant activity rate"
          gradient="from-pink-500 to-rose-600"
        />
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>Subscription plan breakdown across tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.tenantsByPlan?.map((plan, index) => (
              <div key={plan.planName || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{plan.planName}</div>
                  <div className="text-sm text-muted-foreground">{plan.count} tenants</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {plan.percentage}%
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No plan distribution data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest tenant registrations and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentTenants?.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Date(tenant.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : tenant.status === 'suspended'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status}
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
