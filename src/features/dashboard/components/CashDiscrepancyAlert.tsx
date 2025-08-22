/**
 * @file components/dashboard/CashDiscrepancyAlert.tsx
 * @description Component to show cash discrepancy alerts on dashboard
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useDiscrepancySummary } from '@/hooks/api/useReconciliationDiff';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';

export function CashDiscrepancyAlert() {
  const { data: summary, isLoading } = useDiscrepancySummary();

  if (isLoading || !summary || summary.totalDiscrepancies === 0) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          Cash Discrepancies Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{summary.totalDiscrepancies}</div>
            <div className="text-sm text-yellow-600">Total Discrepancies</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-xl font-bold text-red-600">{summary.totalOverReported}</span>
            </div>
            <div className="text-sm text-red-600">Over-reported</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              <span className="text-xl font-bold text-blue-600">{summary.totalUnderReported}</span>
            </div>
            <div className="text-sm text-blue-600">Under-reported</div>
          </div>
        </div>

        {summary.largestDiscrepancy > 0 && (
          <div className="mb-4 p-3 bg-red-100 rounded-lg">
            <div className="text-sm font-medium text-red-800">
              Largest Discrepancy: {formatCurrency(summary.largestDiscrepancy)}
            </div>
          </div>
        )}

        {summary.recentDiscrepancies.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium text-yellow-800">Recent Discrepancies:</div>
            {summary.recentDiscrepancies.slice(0, 3).map((diff) => (
              <div key={diff.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <div className="font-medium">{diff.stationName}</div>
                  <div className="text-sm text-muted-foreground">{diff.date}</div>
                </div>
                <div className="text-right">
                  <Badge variant={diff.status === 'over' ? 'destructive' : 'secondary'}>
                    {diff.status === 'over' ? '+' : ''}{formatCurrency(diff.difference)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button asChild size="sm" className="w-full">
          <Link to="/dashboard/reconciliation/differences">
            <Eye className="mr-2 h-4 w-4" />
            View All Discrepancies
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}