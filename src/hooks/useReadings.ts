
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsApi, CreateReadingRequest } from '@/api/readings';
import { useToast } from '@/hooks/use-toast';

export const useCreateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: readingsApi.createReading,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: "Success",
        description: "Reading recorded successfully. Sale auto-generated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record reading",
        variant: "destructive",
      });
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['readings', 'latest', nozzleId],
    queryFn: () => readingsApi.getLatestReading(nozzleId),
    enabled: !!nozzleId,
  });
};
