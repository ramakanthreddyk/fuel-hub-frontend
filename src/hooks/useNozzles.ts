import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzleService, CreateNozzleRequest } from '@/services/nozzleService';
import type { Nozzle } from '../../contract/models';

export const useNozzles = (pumpId?: string) => {
  return useQuery({
    queryKey: ['nozzles', pumpId],
  queryFn: () => nozzleService.getNozzles(pumpId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNozzle = (id: string) => {
  return useQuery({
    queryKey: ['nozzle', id],
  queryFn: () => nozzleService.getNozzle(id),
    enabled: !!id,
  });
};

export const useCreateNozzle = () => {
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: (data: CreateNozzleRequest) => nozzleService.createNozzle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
    },
  });
};

export const useUpdateNozzle = () => {
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<CreateNozzleRequest> }) => nozzleService.updateNozzle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
    },
  });
};

export const useDeleteNozzle = () => {
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: (id: string) => nozzleService.deleteNozzle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
    },
  });
};
