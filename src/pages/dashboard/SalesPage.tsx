
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesTable } from '@/components/sales/SalesTable';
import { StationSelector } from '@/components/filters/StationSelector';
import { DateRangePicker, DateRange } from '@/components/filters/DateRangePicker';
import { useSales } from '@/hooks/api/useSales';
import { SalesFilters } from '@/api/services/salesService';
import { useDataStore } from '@/store/dataStore';
import { BadgeIndianRupee, TrendingUp, CreditCard, Users, Download, Filter, BarChart3, Fuel, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatVolume, formatSafeNumber } from '@/utils/formatters';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsiveIconSize,
  getResponsivePadding,
  getResponsiveGap
} from '@/utils/mobileFormatters';

export default function SalesPage() {
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { isMobile } = useMobileFormatters();
  
  const filters: SalesFilters = {
    stationId: selectedStation,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  };
  
  const { data: sales = [], isLoading } = useSales(filters);
  const { stations } = useDataStore();

  // Get all stations from store (flatten if nested)
  const allStations = Object.values(stations).flat();
  
  // Calculate summary stats with safe number handling
  const totalAmount = sales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const totalVolume = sales.reduce((sum, sale) => {
    const volume = typeof sale.volume === 'number' ? sale.volume : 0;
    return sum + (isNaN(volume) ? 0 : volume);
  }, 0);
  
  const creditSales = sales.filter(sale => sale.payment_method === 'credit' || sale.paymentMethod === 'credit');
  const creditAmount = creditSales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const postedSales = sales.filter(sale => sale.status === 'posted');

  return (
    <div className={`min-h-screen bg-gray-50/50 ${getResponsivePadding('base')}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm`}>
              <Target className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={`${getResponsiveTextSize('2xl')} font-bold text-gray-900 truncate`}>Sales Management</h1>
              <p className={`text-gray-600 ${getResponsiveTextSize('sm')} mt-1`}>View and analyze all sales transactions across stations</p>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative z-10">
              <StationSelector
                value={selectedStation}
                onChange={setSelectedStation}
                showAll={true}
                placeholder="All Stations"
              />
            </div>
            <div className="relative z-20">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
              />
            </div>
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
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Detailed Sales Transactions
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {selectedStation ? 'Station-specific' : 'All'} sales with payment methods, fuel types, and volumes
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {sales.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Transactions
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SalesTable sales={sales} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
