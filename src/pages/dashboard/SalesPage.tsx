
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesTable } from '@/components/sales/SalesTable';
import { StationSelector } from '@/components/filters/StationSelector';
import { DateRangePicker, DateRange } from '@/components/filters/DateRangePicker';
import { useSales } from '@/hooks/api/useSales';
import { SalesFilters } from '@/api/services/salesService';
import { useStations } from '@/hooks/api/useStations';
import { BadgeIndianRupee, TrendingUp, CreditCard, Users, Download, Filter, BarChart3, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatVolume, formatSafeNumber } from '@/utils/formatters';

export default function SalesPage() {
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const filters: SalesFilters = {
    stationId: selectedStation,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  };
  
  const { data: sales = [], isLoading } = useSales(filters);
  const { data: stations = [] } = useStations();

  // Calculate summary stats with safe number handling
  const totalAmount = sales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const totalVolume = sales.reduce((sum, sale) => {
    const volume = typeof sale.volume === 'number' ? sale.volume : 0;
    return sum + (isNaN(volume) ? 0 : volume);
  }, 0);
  
  const creditSales = sales.filter(sale => sale.paymentMethod === 'credit');
  const creditAmount = creditSales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const postedSales = sales.filter(sale => sale.status === 'posted');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sales Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            View and analyze all sales transactions across stations
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-blue-50 via-white to-green-50 border-2 border-blue-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
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
            <Button variant="outline" className="bg-white border-2 shadow-sm hover:shadow-md">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Total Sales</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <BadgeIndianRupee className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(totalAmount, { useLakhsCrores: true })}</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {formatSafeNumber(sales.length, 0, true)} transactions
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Volume</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Fuel className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{formatVolume(totalVolume, 3, true)}</div>
            <div className="flex items-center text-sm text-blue-600 mt-2">
              <BarChart3 className="h-4 w-4 mr-1" />
              Fuel dispensed
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Credit Sales</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{formatCurrency(creditAmount, { useLakhsCrores: true })}</div>
            <div className="flex items-center text-sm text-orange-600 mt-2">
              <CreditCard className="h-4 w-4 mr-1" />
              {formatSafeNumber(creditSales.length, 0)} credit transactions
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Posted Sales</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{formatSafeNumber(postedSales.length, 0, true)}</div>
            <div className="flex items-center text-sm text-purple-600 mt-2">
              <Users className="h-4 w-4 mr-1" />
              of {formatSafeNumber(sales.length, 0)} total sales
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card className="shadow-lg border-2 border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-xl">Sales Transactions</CardTitle>
          <CardDescription className="text-base">
            {selectedStation ? 'Station-specific' : 'All'} sales generated from nozzle readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
