
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp, CheckCircle, Package, BarChart3 } from 'lucide-react';
import { superAdminApi } from '@/api/superadmin';
import { MetricsCard } from '@/components/ui/metrics-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/formatters';

export default function SuperAdminOverviewPage() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['superadmin-summary'],
    queryFn: superAdminApi.getSummary
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Platform Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Platform overview and system metrics
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Platform Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Platform overview and system metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Tenants"
            value={summary?.totalTenants || 0}
            icon={<Building2 className="h-5 w-5" />}
            description={`${summary?.activeTenants || 0} active`}
          />

          <MetricsCard
            title="Total Users"
            value={summary?.totalUsers || 0}
            icon={<Users className="h-5 w-5" />}
            description="Across all tenants"
          />

          <MetricsCard
            title="Total Stations"
            value={summary?.totalStations || 0}
            icon={<Gauge className="h-5 w-5" />}
            description="Fuel stations registered"
          />

          <MetricsCard
            title="New This Month"
            value={summary?.signupsThisMonth || 0}
            icon={<TrendingUp className="h-5 w-5" />}
            description="New tenant signups"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Tenants */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Recent Tenants
              </CardTitle>
              <CardDescription>Latest tenant registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary?.recentTenants?.slice(0, 4).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tenant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(tenant.createdAt)}
                      </div>
                    </div>
                    <Badge 
                      className={
                        tenant.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : tenant.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {tenant.status}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-sm text-muted-foreground">No recent tenants</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Plan Distribution
              </CardTitle>
              <CardDescription>Tenants by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary?.tenantsByPlan?.map((plan) => (
                  <div key={plan.planName} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{plan.planName}</span>
                      <span className="text-muted-foreground">{plan.count} ({plan.percentage}%)</span>
                    </div>
                    <Progress value={plan.percentage} className="h-2" />
                  </div>
                )) || (
                  <div className="text-sm text-muted-foreground">No plan data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Platform Health
              </CardTitle>
              <CardDescription>System status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="font-medium">Add Tenant</div>
                  <div className="text-xs text-muted-foreground">Create new organization</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-medium">Manage Users</div>
                  <div className="text-xs text-muted-foreground">Admin user management</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left">
                <Package className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-medium">Update Plans</div>
                  <div className="text-xs text-muted-foreground">Modify subscription plans</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-left">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">Platform insights</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
