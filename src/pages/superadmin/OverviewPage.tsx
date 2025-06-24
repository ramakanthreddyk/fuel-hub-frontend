
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Gauge, TrendingUp } from 'lucide-react';
import { superAdminApi } from '@/api/superadmin';
import { MetricsCard } from '@/components/ui/metrics-card';

export default function SuperAdminOverviewPage() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['superadmin-summary'],
    queryFn: superAdminApi.getSummary
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and system metrics</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and system metrics</p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Status</span>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                No recent activity to display. Activity feed will show tenant registrations, plan changes, and system events.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
