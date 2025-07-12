
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { formatCurrency } from '@/utils/formatters';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ProfitMetricsCardProps {
  filters?: DashboardFilters;
}

export function ProfitMetricsCard({ filters = {} }: ProfitMetricsCardProps) {
  const { data: summary, isLoading, error, refetch } = useSalesSummary('monthly', filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Profit Metrics" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Profit Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const profit = (summary?.totalRevenue || 0) * 0.15; // Assuming 15% profit margin
  const profitMargin = summary?.totalRevenue ? (profit / summary.totalRevenue) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-700">
          Profit Analysis
          {filters.stationId && <span className="text-xs text-muted-foreground block">(Filtered)</span>}
        </CardTitle>
        <div className="p-2 bg-purple-500 rounded-lg">
          <DollarSign className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-700">{formatCurrency(profit)}</div>
        <div className="flex items-center text-xs text-purple-600 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {profitMargin.toFixed(1)}% margin • Est. profit
        </div>
      </CardContent>
    </Card>
  );
}
