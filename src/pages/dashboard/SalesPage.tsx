
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesTable } from '@/components/sales/SalesTable';
import { SalesFilterBar } from '@/components/sales/SalesFilterBar';
import { useSales } from '@/hooks/useSales';
import { SalesFilters } from '@/api/sales';
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';

export default function SalesPage() {
  const [filters, setFilters] = useState<SalesFilters>({});
  const { data: sales = [], isLoading } = useSales(filters);

  // Calculate summary stats
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalVolume = sales.reduce((sum, sale) => sum + sale.volume, 0);
  const creditSales = sales.filter(sale => sale.paymentMethod === 'credit');
  const postedSales = sales.filter(sale => sale.status === 'posted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          View and manage all sales generated from nozzle readings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">
              Fuel dispensed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{creditSales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {creditSales.length} credit transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postedSales.length}</div>
            <p className="text-xs text-muted-foreground">
              of {sales.length} total sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <SalesFilterBar onFiltersChange={setFilters} />

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>
            All sales generated from nozzle readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
