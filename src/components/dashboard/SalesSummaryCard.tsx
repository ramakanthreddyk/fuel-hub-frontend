
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BadgeIndianRupee, Percent } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface SalesSummaryCardProps {
  filters?: DashboardFilters;
}

export function SalesSummaryCard({ filters = {} }: SalesSummaryCardProps) {
  const { data: summary, isLoading, error, refetch } = useSalesSummary('monthly', filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Sales Summary" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            {filters.stationId ? 'Station Sales' : 'Total Sales'}
          </CardTitle>
          <div className="p-2 bg-green-500 rounded-lg">
            <BadgeIndianRupee className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">₹{summary?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {summary?.salesCount || 0} transactions • {summary?.totalVolume?.toLocaleString() || 0}L sold
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-2 border-blue-200/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Growth Metrics</CardTitle>
          <div className="p-2 bg-blue-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{summary?.growthPercentage?.toFixed(1) || 0}%</div>
          <div className="flex items-center text-xs text-blue-600 mt-1">
            <Percent className="h-3 w-3 mr-1" />
            Growth vs previous period
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
