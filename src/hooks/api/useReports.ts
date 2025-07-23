
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';

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
      const response = await api.post('/reports/export', request);
      return response.data;
    },
  });
};

export const useExportReport = useReportExport;

export const useScheduleReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: ScheduleReportRequest) => {
      const response = await api.post('/reports/schedule', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
    },
  });
};
