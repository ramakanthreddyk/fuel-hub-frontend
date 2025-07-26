
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService } from '@/api/services/stationsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
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
  const { showSuccess, handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  return useMutation({
    mutationFn: async (data: any) => {
      showLoader('Creating station...');
      try {
        const result = await stationsService.createStation(data);
        hideLoader();
        return result;
      } catch (error) {
        hideLoader();
        throw error;
      }
    },
    onSuccess: (newStation) => {
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      showSuccess('Station Created', `Station "${newStation.name}" created successfully`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Create Station');
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  const { clearStations } = useDataStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => stationsService.updateStation(id, data),
    onSuccess: (updatedStation, { id }) => {
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      showSuccess('Station Updated', `Station "${updatedStation.name}" updated successfully`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Update Station');
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  const { clearStations } = useDataStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: (id: string) => stationsService.deleteStation(id),
    onSuccess: () => {
      clearStations();
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      showSuccess('Station Deleted', 'Station deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error, 'Delete Station');
    },
  });
};
