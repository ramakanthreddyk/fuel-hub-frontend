
/**
 * @file hooks/api/useReports.ts
 * @description React Query hooks for reports API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report, GenerateReportRequest } from '@/api/unified-reports';

/**
 * Hook to fetch all reports
 * @returns Query result with reports data
 */
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.getReports(),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch a report by ID
 * @param id Report ID
 * @returns Query result with report data
 */
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to generate a report
 * @returns Mutation result for generating a report
 */
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateReportRequest) => reportsApi.generateReport(data),
    onSuccess: (blob) => {
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
      }

      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error) => {
      console.error('[REPORTS-HOOK] Error generating report:', error);
    }
  });
};

/**
 * Hook to download a report
 * @returns Mutation result for downloading a report
 */
export const useDownloadReport = () => {
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
      }
    },
    onError: (error, id) => {
      console.error(`[REPORTS-HOOK] Error downloading report ${id}:`, error);
    }
  });
};
