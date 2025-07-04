
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Mail } from 'lucide-react';
import { reportsService } from '@/api/services/reportsService';

interface ReportExporterProps {
  stationId: string;
  reportType: 'sales' | 'inventory' | 'reconciliation';
  filters: Record<string, any>;
}

export function ReportExporter({ stationId, reportType, filters }: ReportExporterProps) {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [recipients, setRecipients] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        type: reportType,
        format,
        filters: {
          stationId,
          ...filters
        }
      };

      const response = await reportsService.exportReport(exportData);
      
      // Handle blob response
      let blob: Blob;
      if (response instanceof Blob) {
        blob = response;
      } else {
        // If response is not a blob, create one from the data
        blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = async () => {
    setIsScheduling(true);
    try {
      const scheduleData = {
        type: reportType,
        format,
        frequency: 'weekly' as const,
        recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
        filters: {
          stationId,
          ...filters
        }
      };

      await reportsService.scheduleReport(scheduleData);
      
      toast({
        title: "Success",
        description: "Report scheduled successfully",
      });
      
      setRecipients('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule report",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="format">Export Format</Label>
          <Select value={format} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Now'}
        </Button>

        <div className="border-t pt-4">
          <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
          <Input
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
          />
        </div>

        <Button 
          onClick={handleScheduleReport} 
          disabled={isScheduling || !recipients.trim()}
          variant="outline"
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          {isScheduling ? 'Scheduling...' : 'Schedule Weekly Report'}
        </Button>
      </CardContent>
    </Card>
  );
}
