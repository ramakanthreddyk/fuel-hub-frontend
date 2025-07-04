
/**
 * @file SalesOverviewPage.tsx
 * @description Comprehensive sales overview and analytics
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Fuel, Users, Calendar, Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { useSales } from '@/hooks/useSales';
import { formatCurrency, formatDate, formatVolume } from '@/utils/formatters';
import { SalesTable } from '@/components/sales/SalesTable';
import { SalesFilterBar } from '@/components/sales/SalesFilterBar';
import type { SalesFilters } from '@/api/sales';

export default function SalesOverviewPage() {
  const [filters, setFilters] = useState<SalesFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: sales = [], isLoading, error } = useSales(filters);

  // Calculate metrics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const totalVolume = sales.reduce((sum, sale) => sum + (sale.volume || 0), 0);
  const totalTransactions = sales.length;
  const averageTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Payment method breakdown
  const paymentBreakdown = sales.reduce((acc, sale) => {
    const method = sale.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + (sale.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  // Fuel type breakdown
  const fuelBreakdown = sales.reduce((acc, sale) => {
    const fuel = sale.fuelType || 'unknown';
    acc[fuel] = (acc[fuel] || 0) + (sale.volume || 0);
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting sales data...', { filters, sales });
  };

  const handleFiltersChange = (newFilters: SalesFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Overview"
        description="Comprehensive view of sales performance and analytics"
        actions={
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        }
      />

      {/* Sales Filter */}
      <SalesFilterBar filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {formatDate(filters.startDate || '')} - {formatDate(filters.endDate || '')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVolume(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">
              Fuel dispensed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Total sales count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageTransactionValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="capitalize">{method}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Types</CardTitle>
            <CardDescription>Volume by fuel type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(fuelBreakdown).map(([fuel, volume]) => (
                <div key={fuel} className="flex items-center justify-between">
                  <span className="capitalize">{fuel}</span>
                  <span className="font-medium">{formatVolume(volume)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Detailed sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable 
            sales={sales} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
