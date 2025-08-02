/**
 * Contract Readings Hook
 * 
 * React Query hooks for reading management using contract-aligned services.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/contract/readings.service';
import { toast } from '@/hooks/use-toast';
import { invalidateReadingQueries } from '@/utils/queryInvalidation';
import type { CreateReadingRequest } from '@/api/api-contract';

export const useContractReadings = (params?: {
  nozzleId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['contract-readings', params],
    queryFn: () => readingsService.getReadings(params),
  });
};

export const useContractLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['contract-latest-reading', nozzleId],
    queryFn: () => readingsService.getLatestReading(nozzleId),
    enabled: !!nozzleId,
  });
};

export const useContractCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['contract-can-create-reading', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
  });
};

export const useCreateContractReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReadingRequest) => readingsService.createReading(data),
    onSuccess: (newReading) => {
      // Use comprehensive invalidation for dashboard updates
      invalidateReadingQueries(queryClient);

      // Contract-specific queries
      queryClient.invalidateQueries({ queryKey: ['contract-readings'] });
      queryClient.invalidateQueries({ queryKey: ['contract-latest-reading', newReading.nozzleId] });
      queryClient.invalidateQueries({ queryKey: ['contract-can-create-reading', newReading.nozzleId] });

      toast({
        title: "Success",
        description: "Reading recorded successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create reading:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to record reading",
        variant: "destructive",
      });
    },
  });
};