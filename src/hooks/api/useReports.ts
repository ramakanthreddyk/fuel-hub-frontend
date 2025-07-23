
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface ReportExportRequest {
  reportType: string;
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface ScheduleReportRequest {
  reportType: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
}

export const useReportExport = () => {
  return useMutation({
    mutationFn: async (request: ReportExportRequest) => {
      const response = await apiClient.post('/reports/export', request);
      return response.data;
    },
  });
};

export const useExportReport = useReportExport;
export const useGenerateReport = useReportExport; // Alias for backward compatibility
export const useDownloadReport = useReportExport; // Another alias for backward compatibility
export const useReports = useReportExport; // Another alias for backward compatibility

export const useScheduleReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: ScheduleReportRequest) => {
      const response = await apiClient.post('/reports/schedule', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
    },
  });
};
