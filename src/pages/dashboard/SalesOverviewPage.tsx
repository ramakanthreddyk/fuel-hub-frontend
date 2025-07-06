
/**
 * @file SalesOverviewPage.tsx
 * @description Comprehensive sales overview and analytics
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BadgeIndianRupee, Fuel, Users, Calendar, Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { useSales } from '@/hooks/api/useSales';
import { formatCurrency, formatDate, formatVolume } from '@/utils/formatters';
import { SalesTable } from '@/components/sales/SalesTable';
import { StationSelector } from '@/components/filters/StationSelector';
import { DateRangePicker, DateRange } from '@/components/filters/DateRangePicker';
import type { SalesFilters } from '@/api/services/salesService';

export default function SalesOverviewPage() {
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  const filters: SalesFilters = {
    stationId: selectedStation,
    startDate: dateRange?.from?.toISOString().split('T')[0],
    endDate: dateRange?.to?.toISOString().split('T')[0],
  };
  
  console.log('Sales filters:', filters);

  const { data: sales = [], isLoading, error } = useSales(filters);
  
  console.log('Sales data:', sales.length, 'records');
  console.log('First sale:', sales[0]);

  // Calculate metrics from sales data
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sales Overview & Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Comprehensive analysis of sales performance and trends
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Total Revenue</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <BadgeIndianRupee className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">₹{totalSales.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {totalTransactions} transactions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Volume Sold</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Fuel className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{formatVolume(totalVolume)}</div>
            <div className="flex items-center text-sm text-blue-600 mt-2">
              <Fuel className="h-4 w-4 mr-1" />
              Total fuel dispensed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Avg Transaction</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <BadgeIndianRupee className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">₹{averageTransactionValue.toLocaleString()}</div>
            <div className="flex items-center text-sm text-purple-600 mt-2">
              <Users className="h-4 w-4 mr-1" />
              Per transaction
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Time Period</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-700">
              {dateRange?.from && dateRange?.to ? 
                `${formatDate(dateRange.from.toISOString())} - ${formatDate(dateRange.to.toISOString())}` : 
                'All Time'
              }
            </div>
            <div className="flex items-center text-sm text-orange-600 mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              Selected range
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-blue-50 via-white to-green-50 border-2 border-blue-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Sales Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <StationSelector
              value={selectedStation}
              onChange={setSelectedStation}
              showAll={true}
              placeholder="All Stations"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
            <Button 
              onClick={() => {
                setSelectedStation(undefined);
                setDateRange(undefined);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="shadow-lg border-2 border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-xl">Detailed Sales Transactions</CardTitle>
          <CardDescription className="text-base">
            All sales transactions with payment methods, fuel types, and volumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
