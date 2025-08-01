
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BadgeIndianRupee } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { SalesEmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatVolume, formatSafeNumber } from '@/utils/formatters';

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

  // Check if this is an authentication error
  const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;

  if (error && isAuthError) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Sales Summary" />;
  }

  // If there's an error but it's not auth-related, or if there's no data, show empty state
  if (error && !isAuthError) {
    return <SalesEmptyState onRefresh={() => refetch()} />;
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

  // Show empty state if no data
  if (!summary || (summary.totalRevenue === 0 && summary.salesCount === 0)) {
    return <SalesEmptyState onRefresh={() => refetch()} />;
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
          <div className="text-2xl font-bold text-green-700">{formatCurrency(summary?.totalRevenue, { useLakhsCrores: true })}</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {formatSafeNumber(summary?.salesCount || 0, 0, true)} transactions • {formatVolume(summary?.totalVolume || 0, 3, true)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-2 border-blue-200/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Transaction Details</CardTitle>
          <div className="p-2 bg-blue-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{formatSafeNumber(summary?.salesCount || 0, 0, true)}</div>
          <div className="flex items-center text-xs text-blue-600 mt-1">
            Total transactions this period
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
