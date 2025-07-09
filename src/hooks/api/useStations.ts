
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService } from '@/api/services/stationsService';
import { toast } from '@/hooks/use-toast';

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: stationsService.getStations,
    staleTime: 60000,
    retry: 2,
    onError: (error: any) => {
      console.error('Failed to fetch stations:', error);
      toast({
        title: "Error",
        description: "Failed to load stations. Please try again.",
        variant: "destructive",
      });
    }
  });
};

export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsService.getStation(id),
    enabled: !!id,
    staleTime: 60000,
    onError: (error: any) => {
      console.error('Failed to fetch station:', error);
      toast({
        title: "Error",
        description: "Failed to load station details. Please try again.",
        variant: "destructive",
      });
    }
  });
};

export const useCreateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => stationsService.createStation(data),
    onSuccess: (newStation) => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: `Station "${newStation.name}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create station:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create station. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => stationsService.updateStation(id, data),
    onSuccess: (updatedStation, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: `Station "${updatedStation.name}" updated successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to update station:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update station. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => stationsService.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: "Station deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete station:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete station. Please try again.",
        variant: "destructive",
      });
    },
  });
};
