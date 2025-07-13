
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Percent } from 'lucide-react';
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
    return <ErrorFallback error={error} onRetry={() => refetch()} compact />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Profit Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Calculate profit metrics from available data
  const totalRevenue = summary?.totalRevenue || 0;
  const cashSales = summary?.cashSales || 0;
  const creditSales = summary?.creditSales || 0;
  
  // Simple profit calculation (assuming some margin)
  const estimatedProfit = totalRevenue * 0.15; // 15% estimated margin
  const profitMarginPercentage = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Profit Metrics</CardTitle>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(estimatedProfit, { useLakhsCrores: true })}</div>
            <p className="text-xs text-muted-foreground">Estimated Profit</p>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {profitMarginPercentage.toFixed(1)}% margin
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
