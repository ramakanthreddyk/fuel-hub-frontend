/**
 * @file pages/dashboard/ReportsPage.tsx
 * @description Page for managing reports
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  FileText, 
  File, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useReports, useGenerateReport, useDownloadReport } from '@/hooks/api/useReports';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScheduleReportForm } from '@/components/reports/ScheduleReportForm';
import { ExportReportForm } from '@/components/reports/ExportReportForm';

export default function ReportsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch reports
  const {
    data: reports = [],
    isLoading: reportsLoading,
    refetch: refetchReports
  } = useReports();
  
  // Fetch stations for filtering
  const { data: stations = [] } = useStations();
  
  // Report mutations
  const generateReport = useGenerateReport();
  const downloadReport = useDownloadReport();
  
  // Form for generating reports
  const form = useForm({
    defaultValues: {
      name: '',
      type: 'sales',
      format: 'pdf',
      startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      stationId: 'all'
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchReports();
    setIsRefreshing(false);
  };

  const handleDownload = (reportId: string) => {
    downloadReport.mutate(reportId);
  };

  const onSubmit = (data: any) => {
    generateReport.mutate({
      reportType: data.type,
      format: data.format,
      dateRange: {
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString()
      },
      filters:
        data.stationId && data.stationId !== 'all'
          ? { stationId: data.stationId }
          : undefined
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
        refetchReports(); // Refresh the reports list
        toast({
          title: "Report Generated",
          description: "Your report has been generated successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to generate report. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'inventory':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'readings':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (reportsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FuelLoader size="md" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports Center</h1>
                <p className="text-gray-600 text-sm sm:text-base">Generate, schedule, and manage business reports</p>
              </div>
            </div>
            <div className="flex gap-2">
          <ScheduleReportForm />
          <ExportReportForm />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <FileSpreadsheet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Generate Report</span>
                <span className="xs:hidden">Generate</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a new report with your desired parameters
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: 'Report name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                    <Button type="submit" disabled={generateReport.isPending}>
                      {generateReport.isPending ? "Generating..." : "Generate Report"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <RefreshCw className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Refresh</span>
            <span className="xs:hidden">↻</span>
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Generate your first report to get started
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="text-sm sm:text-base">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getReportIcon(report.type)}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-base truncate">{report.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {report.dateRange ?
                          `${new Date(report.dateRange.start).toLocaleDateString()} - ${new Date(report.dateRange.end).toLocaleDateString()}` :
                          'Date range not available'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getFormatIcon(report.format)}
                    {getStatusIcon(report.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Created: {new Date(report.createdAt).toLocaleString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.id)}
                    disabled={report.status !== 'completed' || downloadReport.isPending}
                    className="text-xs sm:text-sm px-2 sm:px-3 w-full sm:w-auto"
                  >
                    <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Download</span>
                    <span className="xs:hidden">↓</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
