
/**
 * @file hooks/api/useReports.ts
 * @description React Query hooks for reports API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedReportsApi } from '@/api/unified-reports';
import type { SalesReportFilters } from '@/api/api-contract';

/**
 * Hook to fetch sales report
 * @param filters Report filters
 * @returns Query result with sales report data
 */
export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => unifiedReportsApi.getSalesReport(filters),
    enabled: !!(filters.startDate && filters.endDate),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to generate a report (placeholder for now)
 * @returns Mutation result for generating a report
 */
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      console.log('[REPORTS-HOOK] Generate report requested:', data);
      // For now, return a mock response
      return new Blob(['Mock report content'], { type: 'application/pdf' });
    },
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
      }

      queryClient.invalidateQueries({ queryKey: ['sales-report'] });
    },
    onError: (error) => {
      console.error('[REPORTS-HOOK] Error generating report:', error);
    }
  });
};

/**
 * Hook to download a report (placeholder for now)
 * @returns Mutation result for downloading a report
 */
export const useDownloadReport = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('[REPORTS-HOOK] Download report requested for ID:', id);
      // For now, return a mock response
      return new Blob(['Mock report content'], { type: 'application/pdf' });
    },
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

/**
 * Hook to fetch all reports (placeholder for now)
 * @returns Query result with reports data
 */
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      console.log('[REPORTS-HOOK] Fetching reports list');
      // For now, return mock data
      return [];
    },
    staleTime: 60000, // 1 minute
    retry: 2
  });
};
