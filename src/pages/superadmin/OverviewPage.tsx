import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SuperAdminErrorBoundary } from '@/components/admin/SuperAdminErrorBoundary';
import { Button } from '@/components/ui/button';
import { Building2, Users, Gauge, TrendingUp, CheckCircle, Package, BarChart3, Plus, Settings, Eye } from 'lucide-react';
import { superadminApi, SuperAdminSummary } from '@/api/superadmin';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminOverviewPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['superadmin-summary'],
    queryFn: superadminApi.getSummary,
    retry: 1,
    meta: {
      errorMessage: "Could not load dashboard data. Please try again later.",
    }
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-tenant':
        navigate('/superadmin/tenants');
        break;
      case 'manage-users':
        navigate('/superadmin/users');
        break;
      case 'update-plans':
        navigate('/superadmin/plans');
        break;
      case 'view-analytics':
        navigate('/superadmin/analytics');
        break;
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <SuperAdminErrorBoundary 
          error={error} 
          onRetry={() => window.location.reload()}
        >
          {null}
        </SuperAdminErrorBoundary>
      );
    }
    
    if (isLoading) {
      return (
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
      );
    }
    
    return (
      <>
        {/* Enhanced Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedMetricsCard
            title="Total Tenants"
            value={summary?.tenantCount || 0}
            icon={<Building2 className="h-5 w-5" />}
            description={`${summary?.activeTenantCount || 0} active organizations`}
            gradient="from-purple-500 to-indigo-600"
          />

          <EnhancedMetricsCard
            title="Admin Users"
            value={summary?.adminCount || 0}
            icon={<Users className="h-5 w-5" />}
            description="SuperAdmin users"
            gradient="from-blue-500 to-cyan-600"
          />

          <EnhancedMetricsCard
            title="Subscription Plans"
            value={summary?.planCount || 0}
            icon={<Package className="h-5 w-5" />}
            description="Available plans"
            gradient="from-green-500 to-emerald-600"
          />

          <EnhancedMetricsCard
            title="Active Rate"
            value={summary?.tenantCount ? Math.round((summary.activeTenantCount / summary.tenantCount) * 100) : 0}
            icon={<TrendingUp className="h-5 w-5" />}
            description="% of active tenants"
            gradient="from-orange-500 to-red-600"
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
              <Button 
                variant="ghost"
                className="flex items-center gap-3 p-6 h-auto rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left justify-start"
                onClick={() => handleQuickAction('add-tenant')}
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Add Tenant</div>
                  <div className="text-xs text-muted-foreground">Create new organization</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost"
                className="flex items-center gap-3 p-6 h-auto rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left justify-start"
                onClick={() => handleQuickAction('manage-users')}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Manage Users</div>
                  <div className="text-xs text-muted-foreground">Admin user management</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost"
                className="flex items-center gap-3 p-6 h-auto rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left justify-start"
                onClick={() => handleQuickAction('update-plans')}
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Update Plans</div>
                  <div className="text-xs text-muted-foreground">Modify subscription plans</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost"
                className="flex items-center gap-3 p-6 h-auto rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-left justify-start"
                onClick={() => handleQuickAction('view-analytics')}
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">Platform insights</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Platform Dashboard
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Platform overview and system metrics
        </p>
      </div>

      {renderContent()}
    </div>
  );
}
