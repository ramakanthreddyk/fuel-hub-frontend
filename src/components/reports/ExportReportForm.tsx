import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStations } from '@/hooks/api/useStations';
import { useExportReport } from '@/hooks/api/useReports';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Download } from 'lucide-react';


export function ExportReportForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: stations = [] } = useStations();
  const exportReport = useExportReport();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      type: 'sales',
      format: 'pdf',
      startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      stationId: 'all',
    },
  });

  const onSubmit = (data: any) => {
    exportReport.mutate({
      type: data.type,
      format: data.format,
      dateRange: {
        from: new Date(data.startDate).toISOString(),
        to: new Date(data.endDate).toISOString(),
      },
      filters:
        data.stationId && data.stationId !== 'all'
          ? { stationId: data.stationId }
          : undefined,
    }, {
      onSuccess: (response) => {
        if (response?.data?.data) {
          generatePDFReport(response.data.data, response.data.summary, data);
        }
        setIsOpen(false);
        toast({
          title: '📊 Report Generated Successfully!',
          description: `PDF report with ${response?.data?.summary?.totalRecords || 0} records has been downloaded.`,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: 'Failed to export report. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const generatePDFReport = (data: any[], summary: any, formData: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FuelSync ${formData.type.toUpperCase()} Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #2980b9; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #2980b9; font-size: 24px; font-weight: bold; }
          .title { font-size: 18px; margin: 10px 0; }
          .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .summary h3 { margin: 0 0 10px 0; color: #2980b9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2980b9; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .amount { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">FUELSYNC</div>
          <div class="title">${formData.type.toUpperCase()} REPORT</div>
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
          <div>Period: ${formData.startDate} to ${formData.endDate}</div>
        </div>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Records:</strong> ${summary?.totalRecords || 0}</p>
          <p><strong>Total Sales:</strong> ₹${parseFloat(summary?.totalSales || 0).toLocaleString()}</p>
          <p><strong>Total Profit:</strong> ₹${parseFloat(summary?.totalProfit || 0).toLocaleString()}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Station</th>
              <th>Fuel Type</th>
              <th>Volume (L)</th>
              <th>Price/L</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.slice(0, 100).map(row => `
              <tr>
                <td>${row.station_name}</td>
                <td>${row.fuel_type.toUpperCase()}</td>
                <td class="amount">${parseFloat(row.volume).toFixed(2)}</td>
                <td class="amount">₹${parseFloat(row.fuel_price).toFixed(2)}</td>
                <td class="amount">₹${parseFloat(row.amount).toLocaleString()}</td>
                <td>${row.payment_method.toUpperCase()}</td>
                <td>${new Date(row.recorded_at).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          Generated by FuelSync © 2025
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Export a report with your desired parameters
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sales">Sales Report</SelectItem>
                        <SelectItem value="inventory">Inventory Report</SelectItem>
                        <SelectItem value="readings">Readings Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: 'Start date is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                rules={{ required: 'End date is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="stationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Stations" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Stations</SelectItem>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={exportReport.isPending}>
                {exportReport.isPending
                  ? 'Exporting...'
                  : 'Export Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
