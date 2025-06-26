
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { reportsApi } from '@/api/reports';
import { SalesReportFilters } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

interface CSVExportButtonProps {
  filters: SalesReportFilters;
  disabled?: boolean;
}

export function CSVExportButton({ filters, disabled }: CSVExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await reportsApi.exportSalesCSV(filters);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales-report-${filters.startDate}-${filters.endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Export successful',
        description: 'Sales report has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Unable to export sales report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant="outline"
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}
