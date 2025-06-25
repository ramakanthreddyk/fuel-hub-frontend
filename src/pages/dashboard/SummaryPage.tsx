
import { useState } from 'react';
import { StationSelector } from '@/components/filters/StationSelector';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { StationMetricsCard } from '@/components/dashboard/StationMetricsCard';
import { SalesSummaryCard } from '@/components/dashboard/SalesSummaryCard';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { FuelBreakdownChart } from '@/components/dashboard/FuelBreakdownChart';
import { TopCreditorsTable } from '@/components/dashboard/TopCreditorsTable';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { OrganizationHierarchy } from '@/components/dashboard/OrganizationHierarchy';
import { useStationMetrics } from '@/hooks/useDashboard';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Filter } from 'lucide-react';

export default function SummaryPage() {
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: stationMetrics = [] } = useStationMetrics();

  const filters = {
    stationId: selectedStation,
    dateFrom: dateRange?.from?.toISOString(),
    dateTo: dateRange?.to?.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor performance across all stations and track key metrics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
      </div>

      {/* Station Metrics Overview */}
      {!selectedStation && stationMetrics.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Station Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stationMetrics.slice(0, 6).map((station) => (
                <StationMetricsCard
                  key={station.id}
                  station={station}
                  onClick={() => setSelectedStation(station.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <SalesSummaryCard filters={filters} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <PaymentMethodChart filters={filters} />
        <FuelBreakdownChart filters={filters} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesTrendChart filters={filters} />
        <TopCreditorsTable filters={filters} />
      </div>

      {/* Organization Hierarchy */}
      <OrganizationHierarchy />

      {selectedStation && (
        <div className="flex justify-center">
          <button
            onClick={() => setSelectedStation(undefined)}
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            View all stations
          </button>
        </div>
      )}
    </div>
  );
}
