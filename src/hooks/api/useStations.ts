
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService } from '@/api/services/stationsService';
import { toast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';

export const useStations = () => {
  const { stations: storedStations, setStations } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      // Check if we have cached data
      if (storedStations.length > 0) {
        console.log('[STATIONS-HOOK] Using cached stations');
        return storedStations;
      }
      
      const stations = await stationsService.getStations();
      
      // Store in cache
      setStations(stations);
      
      return stations;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      handleError(error, 'Failed to fetch stations.');
    },
  });
};

export const useStation = (id: string) => {
  const { stations: storedStations } = useDataStore();
  
  return useQuery({
    queryKey: ['station', id],
    queryFn: async () => {
      // Check if we have cached data
      const cachedStation = storedStations.find(s => s.id === id);
      if (cachedStation) {
        console.log('[STATIONS-HOOK] Using cached station:', id);
        return cachedStation;
      }
      
      return stationsService.getStation(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateStation = () => {
  const queryClient = useQueryClient();
  const { clearStations } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: any) => stationsService.createStation(data),
    onSuccess: (newStation) => {
      // Clear cached stations to force a refresh
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: `Station "${newStation.name}" created successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to create station.');
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  const { clearStations } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => stationsService.updateStation(id, data),
    onSuccess: (updatedStation, { id }) => {
      // Clear cached stations to force a refresh
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: `Station "${updatedStation.name}" updated successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to update station.');
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  const { clearStations } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => stationsService.deleteStation(id),
    onSuccess: () => {
      // Clear cached stations to force a refresh
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: "Station deleted successfully",
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to delete station.');
    },
  });
};
