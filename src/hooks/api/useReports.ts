
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';

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
  const { showSuccess, handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  return useMutation({
    mutationFn: async (request: ReportExportRequest) => {
      showLoader(`Generating ${request.format.toUpperCase()} report...`);
      const response = await apiClient.post('/reports/export', request);
      hideLoader();
      return response.data;
    },
    onSuccess: (data, variables) => {
      showSuccess('Report Generated', `${variables.format.toUpperCase()} report has been generated successfully`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Report Generation');
    }
  });
};

export const useExportReport = useReportExport;
export const useGenerateReport = useReportExport; // Alias for backward compatibility
export const useDownloadReport = useReportExport; // Another alias for backward compatibility
export const useReports = useReportExport; // Another alias for backward compatibility

export const useScheduleReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: async (request: ScheduleReportRequest) => {
      const response = await apiClient.post('/reports/schedule', request);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      showSuccess('Report Scheduled', `${variables.frequency} report "${variables.title}" has been scheduled`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Schedule Report');
    }
  });
};
