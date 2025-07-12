
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendantReadingsService, CreateAttendantReadingRequest, CreateCashReportRequest } from '@/api/services/attendantReadingsService';
import { toast } from '@/hooks/use-toast';
import { invalidateReadingQueries } from '@/utils/queryInvalidation';

export const useAttendantReadings = (filters?: any) => {
  return useQuery({
    queryKey: ['attendant-readings', filters],
    queryFn: () => attendantReadingsService.getReadings(filters),
    retry: 1,
    staleTime: 30000,
  });
};

export const useLatestNozzleReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['attendant-readings', 'latest', nozzleId],
    queryFn: async () => {
      if (!nozzleId) return null;
      const readings = await attendantReadingsService.getReadings({ nozzleId, limit: 1 });
      return readings.length > 0 ? readings[0] : null;
    },
    enabled: !!nozzleId,
    retry: 1,
    staleTime: 30000,
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['attendant-readings', 'can-create', nozzleId],
    queryFn: async () => {
      if (!nozzleId) return { canCreate: false, reason: 'No nozzle selected' };
      // For attendants, we'll assume they can always create readings unless there's a specific restriction
      return { canCreate: true };
    },
    enabled: !!nozzleId,
    retry: 1,
    staleTime: 30000,
  });
};

export const useCreateAttendantReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAttendantReadingRequest) => attendantReadingsService.createReading(data),
    onSuccess: () => {
      invalidateReadingQueries(queryClient);
      
      toast({
        title: 'Reading Submitted',
        description: 'Your fuel reading has been successfully submitted.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      console.error('Failed to submit reading:', error);
      toast({
        title: 'Submission Failed',
        description: error?.response?.data?.message || 'Failed to submit reading. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useSubmitCashReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCashReportRequest) => attendantReadingsService.submitCashReport(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['cash-reports'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
      queryClient.invalidateQueries({ queryKey: ['station-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['payment-method-breakdown'] });
      
      toast({
        title: 'Cash Report Submitted',
        description: 'Your cash report has been successfully submitted.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      console.error('Failed to submit cash report:', error);
      toast({
        title: 'Submission Failed',
        description: error?.response?.data?.message || 'Failed to submit cash report. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useCashReports = (filters?: any) => {
  return useQuery({
    queryKey: ['cash-reports', filters],
    queryFn: () => attendantReadingsService.getCashReports(filters),
    retry: 1,
    staleTime: 30000,
  });
};
