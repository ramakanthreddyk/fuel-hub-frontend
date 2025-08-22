
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportSalesCSV } from '@/services/reportService';
import { SalesReportFilters } from '../../../contract/salesReport';
import { useToast } from '@/hooks/use-toast';

interface CSVExportButtonProps {
  filters: SalesReportFilters;
  disabled?: boolean;
}

export function CSVExportButton(props: Readonly<CSVExportButtonProps>) {
  const { filters, disabled } = props;
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
  const blob = await exportSalesCSV(filters);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
  // Use fallback if startDate/endDate not present
  const start = (filters as any).startDate || 'from';
  const end = (filters as any).endDate || 'to';
  link.download = `sales-report-${start}-${end}.csv`;
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
        description: `Unable to export sales report: ${error instanceof Error ? error.message : String(error)}`,
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
