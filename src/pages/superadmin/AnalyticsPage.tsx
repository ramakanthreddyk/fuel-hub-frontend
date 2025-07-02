
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { superadminApi } from '@/api/superadmin';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: superadminApi.getSummary,
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Platform Analytics"
          description="Cross-tenant performance metrics and insights"
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
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
            <Button onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          }
        />
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Analytics</h3>
            <p className="text-muted-foreground text-center mb-4">
              There was an error loading the analytics data. This might be because the analytics endpoint is not yet implemented.
            </p>
            <Button onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeRate = analytics && analytics.tenantCount > 0 
    ? Math.round((analytics.activeTenantCount / analytics.tenantCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Cross-tenant performance metrics and insights"
        actions={
          <Button onClick={() => refetch()} disabled={isRefetching} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <EnhancedMetricsCard
              title="Total Tenants"
              value={analytics.tenantCount}
              icon={<Building2 className="h-4 w-4" />}
              description={`${analytics.activeTenantCount} active`}
              gradient="from-purple-500 to-indigo-600"
            />

            <EnhancedMetricsCard
              title="Total Stations"
              value={analytics.totalStations || 0}
              icon={<Gauge className="h-4 w-4" />}
              gradient="from-blue-500 to-cyan-600"
            />

            <EnhancedMetricsCard
              title="Total Users"
              value={analytics.totalUsers || 0}
              icon={<Users className="h-4 w-4" />}
              description="All tenant users"
              gradient="from-green-500 to-emerald-600"
            />

            <EnhancedMetricsCard
              title="Monthly Signups"
              value={analytics.signupsThisMonth || 0}
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
                {analytics.tenantsByPlan && analytics.tenantsByPlan.length > 0 ? (
                  analytics.tenantsByPlan.map((plan, index) => (
                    <div key={plan.planName || index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">{plan.planName || 'Unknown Plan'}</div>
                        <div className="text-sm text-muted-foreground">{plan.count} tenants</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {plan.percentage}%
                      </div>
                    </div>
                  ))
                ) : (
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
                {analytics.recentTenants && analytics.recentTenants.length > 0 ? (
                  analytics.recentTenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(tenant.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tenant.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : tenant.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {tenant.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
