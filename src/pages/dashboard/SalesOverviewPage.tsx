
/**
 * @file SalesOverviewPage.tsx
 * @description Comprehensive sales overview and analytics
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BadgeIndianRupee, Fuel, Users, Calendar, Download } from 'lucide-react';
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
      <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Sales Overview & Analytics
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
              Comprehensive analysis of sales performance and trends
            </p>
          </div>
          <Button 
            size="sm" 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
          >
            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-card-foreground truncate">Total Revenue</CardTitle>
              <div className="p-1 sm:p-1.5 bg-green-500 rounded-lg flex-shrink-0">
                <BadgeIndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground truncate">
                ₹{(totalSales / 10000000).toFixed(1)}Cr
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{totalTransactions} trans</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-card-foreground truncate">Volume Sold</CardTitle>
              <div className="p-1 sm:p-1.5 bg-blue-500 rounded-lg flex-shrink-0">
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground truncate">
                {formatVolume(totalVolume)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Fuel className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Total fuel</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-card-foreground truncate">Avg Transaction</CardTitle>
              <div className="p-1 sm:p-1.5 bg-purple-500 rounded-lg flex-shrink-0">
                <BadgeIndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground truncate">
                ₹{(averageTransactionValue / 1000).toFixed(1)}K
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Per transaction</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-semibold text-card-foreground truncate">Time Period</CardTitle>
              <div className="p-1 sm:p-1.5 bg-orange-500 rounded-lg flex-shrink-0">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs sm:text-sm lg:text-base font-bold text-card-foreground truncate">
                {dateRange?.from && dateRange?.to ? 
                  `7 Days` : 
                  'All Time'
                }
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Selected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl text-card-foreground">
              <div className="p-1.5 bg-primary rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="truncate">Sales Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-end">
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
                className="w-full lg:w-auto lg:flex-shrink-0 text-xs sm:text-sm"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl truncate text-card-foreground">Detailed Sales Transactions</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base truncate text-muted-foreground">
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
