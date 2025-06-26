
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesReportSummary as SummaryData } from '@/api/api-contract';
import { Fuel, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

interface SalesReportSummaryProps {
  summary: SummaryData;
}

export function SalesReportSummary({ summary }: SalesReportSummaryProps) {
  const getTopFuelType = () => {
    const entries = Object.entries(summary.fuelTypeBreakdown);
    if (entries.length === 0) return 'N/A';
    
    const topEntry = entries.reduce((max, current) => 
      current[1].revenue > max[1].revenue ? current : max
    );
    
    return topEntry[0];
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{summary.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalVolume.toLocaleString()}L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Fuel Type</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTopFuelType()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(summary.paymentMethodBreakdown.cash || 0).toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
