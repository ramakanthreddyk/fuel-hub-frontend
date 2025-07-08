
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
  
  const { data: sales = [], isLoading, error } = useSales(filters);

  // Calculate metrics from sales data
  const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const totalVolume = sales.reduce((sum, sale) => sum + (sale.volume || 0), 0);
  const totalTransactions = sales.length;
  const averageTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        {/* Header - Fully Responsive */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Sales Overview & Analytics
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base lg:text-lg">
              Comprehensive analysis of sales performance and trends
            </p>
          </div>
          <Button 
            size="sm" 
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics Cards - Responsive Grid */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-green-700 truncate">Total Revenue</CardTitle>
              <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg flex-shrink-0">
                <BadgeIndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 truncate">
                ₹{totalSales.toLocaleString()}
              </div>
              <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1 sm:mt-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{totalTransactions} transactions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-blue-700 truncate">Volume Sold</CardTitle>
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700 truncate">
                {formatVolume(totalVolume)}
              </div>
              <div className="flex items-center text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2">
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Total fuel dispensed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-purple-700 truncate">Avg Transaction</CardTitle>
              <div className="p-1.5 sm:p-2 bg-purple-500 rounded-lg flex-shrink-0">
                <BadgeIndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700 truncate">
                ₹{averageTransactionValue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs sm:text-sm text-purple-600 mt-1 sm:mt-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Per transaction</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-orange-700 truncate">Time Period</CardTitle>
              <div className="p-1.5 sm:p-2 bg-orange-500 rounded-lg flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-orange-700 truncate">
                {dateRange?.from && dateRange?.to ? 
                  `${formatDate(dateRange.from.toISOString())} - ${formatDate(dateRange.to.toISOString())}` : 
                  'All Time'
                }
              </div>
              <div className="flex items-center text-xs sm:text-sm text-orange-600 mt-1 sm:mt-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Selected range</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Responsive */}
        <Card className="bg-gradient-to-r from-blue-50/50 via-white to-green-50/50 border-blue-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="truncate">Sales Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div className="flex-1 min-w-0">
                <StationSelector
                  value={selectedStation}
                  onChange={setSelectedStation}
                  showAll={true}
                  placeholder="All Stations"
                />
              </div>
              <div className="flex-1 min-w-0">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select date range"
                />
              </div>
              <Button 
                onClick={() => {
                  setSelectedStation(undefined);
                  setDateRange(undefined);
                }}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto lg:flex-shrink-0"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table - Responsive */}
        <Card className="border-2 border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl truncate">Detailed Sales Transactions</CardTitle>
            <CardDescription className="text-sm sm:text-base truncate">
              All sales transactions with payment methods, fuel types, and volumes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <SalesTable sales={sales} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
