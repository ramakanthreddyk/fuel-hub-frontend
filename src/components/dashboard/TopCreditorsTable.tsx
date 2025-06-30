
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTopCreditors } from '@/hooks/useDashboard';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface TopCreditorsTableProps {
  filters?: DashboardFilters;
}

export function TopCreditorsTable({ filters = {} }: TopCreditorsTableProps) {
  const { data: creditors = [], isLoading } = useTopCreditors(5, filters);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Creditors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditors.length) {
    return (
      <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">Top Creditors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No creditors with outstanding amounts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-700">Top Creditors by Outstanding</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party Name</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditors.map((creditor) => {
              const utilizationPercentage = creditor.creditLimit ? 
                (creditor.outstandingAmount / creditor.creditLimit) * 100 : 0;
              
              const getStatusColor = (percentage: number) => {
                if (percentage >= 90) return 'bg-red-100 text-red-800';
                if (percentage >= 70) return 'bg-orange-100 text-orange-800';
                return 'bg-green-100 text-green-800';
              };

              const getStatusLabel = (percentage: number) => {
                if (percentage >= 90) return 'Critical';
                if (percentage >= 70) return 'High';
                return 'Normal';
              };

              return (
                <TableRow key={creditor.id}>
                  <TableCell className="font-medium">{creditor.name}</TableCell>
                  <TableCell className="font-mono">₹{creditor.outstandingAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">
                    {creditor.creditLimit ? `₹${creditor.creditLimit.toLocaleString()}` : 'No limit'}
                  </TableCell>
                  <TableCell>
                    {creditor.creditLimit && (
                      <Badge className={getStatusColor(utilizationPercentage)}>
                        {getStatusLabel(utilizationPercentage)}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
