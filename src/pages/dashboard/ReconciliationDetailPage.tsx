/**
 * @file ReconciliationDetailPage.tsx
 * @description Detailed view of a specific reconciliation
 */
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, AlertTriangle, DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';

interface ReconciliationDetail {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  totalSales: number;
  cashTotal: number;
  cardTotal: number;
  upiTotal: number;
  creditTotal: number;
  finalized: boolean;
  sales: Array<{
    id: string;
    nozzleId: string;
    nozzleNumber: number;
    fuelType: string;
    volume: number;
    amount: number;
    paymentMethod: string;
    recordedAt: string;
  }>;
  cashReports: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    upiAmount: number;
    shift: string;
    reportedAt: string;
  }>;
}

export default function ReconciliationDetailPage() {
  const { reconciliationId } = useParams<{ reconciliationId: string }>();
  const navigate = useNavigate();

  const { data: reconciliation, isLoading } = useQuery({
    queryKey: ['reconciliation', reconciliationId],
    queryFn: async () => {
      const response = await apiClient.get(`/reconciliation/${reconciliationId}`);
      return response.data.data || response.data;
    },
    enabled: !!reconciliationId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reconciliation) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Reconciliation not found</p>
        <Button onClick={() => navigate('/dashboard/reconciliation')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reconciliation
        </Button>
      </div>
    );
  }

  const totalReported = reconciliation.cashTotal + reconciliation.cardTotal + reconciliation.upiTotal;
  const difference = reconciliation.totalSales - totalReported;
  const isMatched = Math.abs(difference) < 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/reconciliation')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Reconciliation Details</h1>
          <p className="text-muted-foreground">{reconciliation.stationName} - {formatDate(reconciliation.date)}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reconciliation.totalSales)}</div>
            <p className="text-xs text-muted-foreground">From system records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReported)}</div>
            <p className="text-xs text-muted-foreground">From cash reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Difference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${difference !== 0 ? 'text-red-600' : 'text-green-600'}`}>
              {difference > 0 ? '+' : ''}{formatCurrency(difference)}
            </div>
            <p className="text-xs text-muted-foreground">
              {difference > 0 ? 'Over-reported' : difference < 0 ? 'Under-reported' : 'Perfect match'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isMatched ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Matched
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Mismatch
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-medium">Cash</div>
                <div className="text-2xl font-bold">{formatCurrency(reconciliation.cashTotal)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-medium">Card</div>
                <div className="text-2xl font-bold">{formatCurrency(reconciliation.cardTotal)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-medium">UPI</div>
                <div className="text-2xl font-bold">{formatCurrency(reconciliation.upiTotal)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Breakdown */}
      {reconciliation.sales && reconciliation.sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Included in Reconciliation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Nozzle</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliation.sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{formatDateTime(sale.recordedAt)}</TableCell>
                    <TableCell>#{sale.nozzleNumber}</TableCell>
                    <TableCell>{sale.fuelType}</TableCell>
                    <TableCell>{sale.volume.toFixed(3)}L</TableCell>
                    <TableCell>{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}