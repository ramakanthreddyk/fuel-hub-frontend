
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import type { SalesReportFilters } from '@/api/api-contract';
import { useSalesReport } from '@/hooks/useReports';
import { SalesReportFilters as ReportFiltersComponent } from '@/components/reports/SalesReportFilters';
import { SalesReportTable } from '@/components/reports/SalesReportTable';
import { SalesReportSummary } from '@/components/reports/SalesReportSummary';
import { CSVExportButton } from '@/components/reports/CSVExportButton';

export default function ReportsPage() {
  const [filters, setFilters] = useState<SalesReportFilters>({
    startDate: undefined,
    endDate: undefined,
    stationId: undefined,
    paymentMethod: undefined
  });
  const { data: reportData, isLoading } = useSalesReport(filters);

  const hasValidDateRange = filters.startDate && filters.endDate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
          <p className="text-muted-foreground">
            Generate detailed sales reports and export data
          </p>
        </div>
        
        {hasValidDateRange && (
          <CSVExportButton filters={filters} disabled={isLoading} />
        )}
      </div>

      <ReportFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {hasValidDateRange && reportData?.summary && (
        <SalesReportSummary summary={reportData.summary} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
          <CardDescription>
            {hasValidDateRange 
              ? 'Detailed sales transactions for the selected period'
              : 'Please select a date range to view sales data'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasValidDateRange ? (
            <SalesReportTable 
              data={reportData?.data || []} 
              isLoading={isLoading} 
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Select start and end dates to generate report
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
