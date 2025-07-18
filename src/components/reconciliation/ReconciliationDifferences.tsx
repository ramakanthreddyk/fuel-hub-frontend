import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { reconciliationApi } from '@/api/reconciliation';
import { ReconciliationDifference } from '@/api/api-contract';

export function ReconciliationDifferences() {
  const { data: differences, isLoading } = useQuery<ReconciliationDifference[]>({
    queryKey: ['reconciliation-differences'],
    queryFn: () => reconciliationApi.getReconciliationDifferences({}),
  });

  if (isLoading) {
    return <div>Loading reconciliation differences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconciliation Differences</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Station</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Difference Type</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {differences?.map((difference) => (
              <TableRow key={difference.id}>
                <TableCell>{difference.stationName}</TableCell>
                <TableCell>{new Date(difference.date).toLocaleDateString()}</TableCell>
                <TableCell>{difference.differenceType}</TableCell>
                <TableCell>{difference.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
