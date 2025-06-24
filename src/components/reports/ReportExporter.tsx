
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportExport } from '@/hooks/useReports';
import { Download, FileText, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportExporterProps {
  stationId?: string;
  dateRange?: { from: Date; to: Date };
}

export function ReportExporter({ stationId, dateRange }: ReportExporterProps) {
  const [reportType, setReportType] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const { exportReport, scheduleReport, isExporting } = useReportExport();
  const { toast } = useToast();

  const handleExport = async () => {
    if (!reportType || !format) {
      toast({
        title: 'Missing Selection',
        description: 'Please select report type and format',
        variant: 'destructive',
      });
      return;
    }

    try {
      await exportReport({
        type: reportType,
        format,
        stationId,
        dateRange,
      });
      
      toast({
        title: 'Export Successful',
        description: 'Report has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Unable to export report',
        variant: 'destructive',
      });
    }
  };

  const handleSchedule = async () => {
    if (!reportType) {
      toast({
        title: 'Missing Selection',
        description: 'Please select report type',
        variant: 'destructive',
      });
      return;
    }

    try {
      await scheduleReport({
        type: reportType,
        stationId,
        frequency: 'weekly',
      });
      
      toast({
        title: 'Report Scheduled',
        description: 'Weekly reports will be emailed to you',
      });
    } catch (error) {
      toast({
        title: 'Scheduling Failed',
        description: 'Unable to schedule report',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Summary</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="creditors">Creditors Report</SelectItem>
                <SelectItem value="performance">Performance Analysis</SelectItem>
                <SelectItem value="reconciliation">Reconciliation Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !reportType || !format}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Now'}
          </Button>
          
          <Button 
            onClick={handleSchedule} 
            variant="outline" 
            disabled={!reportType}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Schedule Weekly
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
