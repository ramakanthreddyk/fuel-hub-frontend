
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyReadingSummary } from '@/api/api-contract';

interface ReconciliationSummaryProps {
  readings: DailyReadingSummary[];
}

export function ReconciliationSummary({ readings }: ReconciliationSummaryProps) {
  const totalExpected = readings.reduce((sum, reading) => sum + reading.saleValue, 0);
  const totalCashDeclared = readings.reduce((sum, reading) => sum + reading.cashDeclared, 0);
  const deltaAmount = totalExpected - totalCashDeclared;

  const getDeltaColor = (delta: number) => {
    if (delta === 0) return 'bg-green-100 text-green-800';
    if (delta > 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getDeltaLabel = (delta: number) => {
    if (delta === 0) return 'Balanced';
    if (delta > 0) return 'Shortfall';
    return 'Excess';
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalExpected.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Expected from sales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Cash Declared</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalCashDeclared.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Reported by attendants</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Delta Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{Math.abs(deltaAmount).toLocaleString()}</div>
          <Badge className={getDeltaColor(deltaAmount)}>
            {getDeltaLabel(deltaAmount)}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readings.length}</div>
          <p className="text-xs text-muted-foreground">Total readings</p>
        </CardContent>
      </Card>
    </div>
  );
}
