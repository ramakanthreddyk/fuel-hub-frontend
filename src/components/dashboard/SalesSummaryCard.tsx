
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';

export function SalesSummaryCard() {
  const { data: summary, isLoading } = useSalesSummary('monthly');

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{summary?.totalSales?.toLocaleString() || 0}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {summary?.transactionCount || 0} transactions • {summary?.totalVolume?.toLocaleString() || 0}L sold
        </div>
      </CardContent>
    </Card>
  );
}
