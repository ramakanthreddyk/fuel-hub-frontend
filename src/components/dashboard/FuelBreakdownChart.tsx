
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFuelTypeBreakdown } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { Fuel } from 'lucide-react';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface FuelBreakdownChartProps {
  filters?: DashboardFilters;
}

export function FuelBreakdownChart({ filters = {} }: FuelBreakdownChartProps) {
  const { data: fuelData, isLoading, error, refetch } = useFuelTypeBreakdown(filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Fuel Breakdown" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Sales by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Fuel Sales by Type
          {filters.stationId && <span className="text-sm text-muted-foreground">(Filtered)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fuelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fuelType" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Sales']} />
            <Bar dataKey="totalSales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
