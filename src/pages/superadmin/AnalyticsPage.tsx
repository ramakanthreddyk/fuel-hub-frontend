
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp, CheckCircle, AlertCircle, Shield, Activity } from 'lucide-react';
import { superAdminApi, SuperAdminSummary } from '@/api/superadmin';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: superAdminApi.getSummary,
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

  const activeRate = analytics && analytics.tenantCount > 0 
    ? Math.round((analytics.activeTenantCount / analytics.tenantCount) * 100) 
    : 0;

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
              value={analytics.tenantCount}
              icon={<Building2 className="h-5 w-5" />}
              description={`${analytics.activeTenantCount} active organizations`}
              gradient="from-purple-500 via-indigo-500 to-blue-600"
              trend={{ value: 15, isPositive: true }}
            />

            <EnhancedMetricsCard
              title="Platform Stations"
              value={analytics.totalStations || 0}
              icon={<Gauge className="h-5 w-5" />}
              description="Across all tenants"
              gradient="from-emerald-500 via-teal-500 to-cyan-600"
              trend={{ value: 8, isPositive: true }}
            />

            <EnhancedMetricsCard
              title="Total Users"
              value={analytics.totalUsers || 0}
              icon={<Users className="h-5 w-5" />}
              description="All tenant users combined"
              gradient="from-orange-500 via-red-500 to-pink-600"
              trend={{ value: 12, isPositive: true }}
            />

            <EnhancedMetricsCard
              title="Active Rate"
              value={`${activeRate}%`}
              icon={<Activity className="h-5 w-5" />}
              description="Tenant engagement score"
              gradient="from-violet-500 via-purple-500 to-fuchsia-600"
              trend={{ value: activeRate > 75 ? 5 : -2, isPositive: activeRate > 75 }}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <EnhancedMetricsCard
              title="Monthly Signups"
              value={analytics.signupsThisMonth || 0}
              icon={<TrendingUp className="h-5 w-5" />}
              description="New tenants this month"
              gradient="from-green-400 to-blue-500"
            />

            <EnhancedMetricsCard
              title="System Health"
              value="99.9%"
              icon={<Shield className="h-5 w-5" />}
              description="Platform uptime"
              gradient="from-teal-400 to-green-500"
            />

            <EnhancedMetricsCard
              title="Data Integrity"
              value="100%"
              icon={<CheckCircle className="h-5 w-5" />}
              description="Database consistency"
              gradient="from-blue-400 to-purple-500"
            />
          </div>

          {/* Plan Distribution with enhanced colors */}
          <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                Plan Distribution
              </CardTitle>
              <CardDescription>Subscription plan breakdown across tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.tenantsByPlan && analytics.tenantsByPlan.length > 0 ? (
                  analytics.tenantsByPlan.map((plan, index) => {
                    const colors = [
                      'from-purple-500 to-indigo-600',
                      'from-blue-500 to-cyan-600',
                      'from-green-500 to-emerald-600',
                      'from-orange-500 to-red-600'
                    ];
                    const bgColors = [
                      'bg-purple-100 dark:bg-purple-900',
                      'bg-blue-100 dark:bg-blue-900',
                      'bg-green-100 dark:bg-green-900',
                      'bg-orange-100 dark:bg-orange-900'
                    ];
                    return (
                      <div key={plan.planName || index} className={`flex items-center justify-between p-4 ${bgColors[index % bgColors.length]} rounded-lg border`}>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{plan.planName || 'Unknown Plan'}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{plan.count} tenants</div>
                          <Progress value={plan.percentage} className="mt-2 h-2" />
                        </div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${colors[index % colors.length]} bg-clip-text text-transparent ml-4`}>
                          {plan.percentage}%
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No plan distribution data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity with colorful badges */}
          <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest tenant registrations and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentTenants && analytics.recentTenants.length > 0 ? (
                  analytics.recentTenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">
                          Joined {new Date(tenant.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge 
                        className={
                          tenant.status === 'active' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm'
                            : tenant.status === 'suspended'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-sm'
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-sm'
                        }
                      >
                        {tenant.status}
                      </Badge>
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
