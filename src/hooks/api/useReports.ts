
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAuth } from '@/contexts/AuthContext';

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

export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'financial' | 'attendance';
  format: 'pdf' | 'excel' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

/**
 * Hook to fetch all reports
 */
export const useReports = () => {
  const { handleApiError } = useToastNotifications();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['reports'],
    queryFn: async (): Promise<Report[]> => {
      try {
        const response = await apiClient.get('/reports');
        return response.data?.data || response.data || [];
      } catch (error) {
        handleApiError(error, 'Load Reports');
        // Return empty array on error to prevent crashes
        return [];
      }
    },
    enabled: user?.role === 'owner' || user?.role === 'manager',
    staleTime: 30000, // 30 seconds
    retry: 2
  });
};

/**
 * Hook to download a report
 */
export const useDownloadReport = () => {
  const { showSuccess, handleApiError } = useToastNotifications();

  return useMutation({
    mutationFn: async (reportId: string): Promise<Blob> => {
      const response = await apiClient.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob, reportId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess('Download Started', 'Your report download has started');
    },
    onError: (error: any) => {
      handleApiError(error, 'Download Report');
    }
  });
};

export const useExportReport = useReportExport;
export const useGenerateReport = useReportExport; // Alias for backward compatibility

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
