/**
 * @file hooks/api/useReports.ts
 * @description React Query hooks for reports API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report, GenerateReportRequest } from '@/api/unified-reports';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch all reports
 * @returns Query result with reports data
 */
export const useReports = () => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.getReports(),
    staleTime: 60000, // 1 minute
    retry: 2,
    onError: (error) => {
      console.error('[REPORTS-HOOK] Failed to fetch reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reports. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to fetch a report by ID
 * @param id Report ID
 * @returns Query result with report data
 */
export const useReport = (id: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    retry: 2,
    onError: (error) => {
      console.error('[REPORTS-HOOK] Failed to fetch report:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch report details. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to generate a report
 * @returns Mutation result for generating a report
 */
export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GenerateReportRequest) => reportsApi.generateReport(data),
    onSuccess: (blob, data) => {
      console.log('[REPORTS-HOOK] Report generated successfully');

      if (blob) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set filename based on report type and format
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${data.name || data.type}-report-${timestamp}.${data.format === 'excel' ? 'xlsx' : data.format}`;
        a.download = filename;
        
        // Trigger download and clean up
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Success',
          description: 'Report generated and downloaded successfully.',
          variant: 'success',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error) => {
      console.error('[REPORTS-HOOK] Failed to generate report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    }
  });
};

/**
 * Hook to download a report
 * @returns Mutation result for downloading a report
 */
export const useDownloadReport = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => reportsApi.downloadReport(id),
    onSuccess: (blob, id) => {
      console.log('[REPORTS-HOOK] Report blob retrieved for report:', id);
      
      // Handle blob download
      if (blob) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set filename based on report ID
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `report-${id}-${timestamp}.pdf`;
        a.download = filename;
        
        // Trigger download and clean up
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Success',
          description: 'Report downloaded successfully.',
          variant: 'success',
        });
      }
    },
    onError: (error, id) => {
      console.error(`[REPORTS-HOOK] Failed to download report ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to download report. Please try again.`,
        variant: 'destructive',
      });
    }
  });
};

/**
 * Hook to schedule a report
 * @returns Mutation result for scheduling a report
 */
export const useScheduleReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => reportsApi.scheduleReport(data),
    onSuccess: () => {
      console.log('[REPORTS-HOOK] Report scheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      toast({
        title: 'Success',
        description: 'Report scheduled successfully.',
        variant: 'success',
      });
    },
    onError: (error) => {
      console.error('[REPORTS-HOOK] Failed to schedule report:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule report. Please try again.',
        variant: 'destructive',
      });
    }
  });
};

/**
 * Hook to export a report
 * @returns Mutation result for exporting a report
 */
export const useExportReport = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => reportsApi.exportReport(data),
    onSuccess: (blob, data) => {
      console.log('[REPORTS-HOOK] Report exported successfully');
      
      if (blob) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set filename based on report type and format
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${data.type}-report-${timestamp}.${data.format === 'excel' ? 'xlsx' : data.format}`;
        a.download = filename;
        
        // Trigger download and clean up
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Success',
          description: 'Report exported and downloaded successfully.',
          variant: 'success',
        });
      }
    },
    onError: (error) => {
      console.error('[REPORTS-HOOK] Failed to export report:', error);
      toast({
        title: 'Error',
        description: 'Failed to export report. Please try again.',
        variant: 'destructive',
      });
    }
  });
};