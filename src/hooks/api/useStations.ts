
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService } from '@/api/services/stationsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';
import { useAuth } from '@/contexts/AuthContext';

export const useStations = (includeMetrics: boolean = false) => {
  const { stations: storedStations, setStations } = useDataStore();
  const { handleError } = useErrorHandler();
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['stations', includeMetrics],
    queryFn: async () => {
      // Don't use cache if metrics are requested
      if (!includeMetrics && Array.isArray(storedStations) && storedStations.length > 0) {
        console.log('[STATIONS-HOOK] Using cached stations');
        return storedStations;
      }

      const response = await stationsService.getStations({ includeMetrics });
      const stations = response.data || [];

      // Store in cache only if no metrics requested
      if (!includeMetrics) {
        setStations(stations);
      }

      return stations;
    },
    enabled: true,
    staleTime: includeMetrics ? 60 * 1000 : 5 * 60 * 1000, // 1 min for metrics, 5 min for basic
    retry: 2,
  });
};

export const useStation = (id: string) => {
  const { stations: storedStations } = useDataStore();
  const { user } = useAuth();
  
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
    enabled: !!id && (user?.role === 'owner' || user?.role === 'manager'),
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
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['setup-status'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
