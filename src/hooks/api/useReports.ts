
/**
 * @file hooks/api/useReports.ts
 * @description React Query hooks for reports API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService, Report, GenerateReportRequest } from '@/api/services/reportsService';

/**
 * Hook to fetch all reports
 * @returns Query result with reports data
 */
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getReports(),
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
    queryFn: () => reportsService.getReport(id),
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
    mutationFn: (data: GenerateReportRequest) => reportsService.generateReport(data),
    onSuccess: (blob) => {
      console.log('[REPORTS-HOOK] Report generated successfully');

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
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
    mutationFn: (id: string) => reportsService.downloadReport(id),
    onSuccess: (downloadUrl) => {
      console.log('[REPORTS-HOOK] Report download URL retrieved:', downloadUrl);
      // Open the download URL in a new tab
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    },
    onError: (error, id) => {
      console.error(`[REPORTS-HOOK] Error downloading report ${id}:`, error);
    }
  });
};
