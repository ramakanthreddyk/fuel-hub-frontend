
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useSuperAdminAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useSuperAdminAnalytics();

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

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">Cross-tenant performance metrics</p>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          Unable to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground">Cross-tenant performance metrics and insights</p>
      </div>

      <AnalyticsDashboard analytics={analytics} />
    </div>
  );
}
