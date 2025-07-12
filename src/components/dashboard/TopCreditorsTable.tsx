
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTopCreditors } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { formatCurrency } from '@/utils/formatters';
import { Users, Loader2 } from 'lucide-react';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface TopCreditorsTableProps {
  filters?: DashboardFilters;
}

export function TopCreditorsTable({ filters = {} }: TopCreditorsTableProps) {
  const { data: creditors = [], isLoading, error, refetch } = useTopCreditors(5, filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Top Creditors" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Creditors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading creditors...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!Array.isArray(creditors) || creditors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Creditors
            {filters.stationId && <span className="text-sm text-muted-foreground">(Filtered)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No creditors found</p>
            <p className="text-sm text-gray-500 mt-2">Credit transactions will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top Creditors
          {filters.stationId && <span className="text-sm text-muted-foreground">(Filtered)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditors.map((creditor) => (
              <TableRow key={creditor.id}>
                <TableCell className="font-medium">
                  {creditor.partyName || creditor.name || 'Unknown Customer'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(creditor.outstandingAmount || 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
