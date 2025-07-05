
/**
 * @file hooks/api/useStations.ts
 * @description React Query hooks for stations API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi, CreateStationData, UpdateStationData } from '@/api/stations';

/**
 * Hook to fetch all stations
 * @returns Query result with stations data
 */
export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
    gcTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch a station by ID
 * @param id Station ID
 * @returns Query result with station data
 */
export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsApi.getStation(id),
    enabled: !!id,
    gcTime: 60000, // 1 minute
  });
};

/**
 * Hook to create a station
 * @returns Mutation result for creating a station
 */
export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStationData) => stationsApi.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      // Also refresh metrics-enabled queries
      queryClient.invalidateQueries({ queryKey: ['stations-with-metrics'] });
    },
  });
};

/**
 * Hook to update a station
 * @returns Mutation result for updating a station
 */
export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationData }) => stationsApi.updateStation(id, data),
    onSuccess: (station, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['stations-with-metrics'] });
    },
  });
};

/**
 * Hook to delete a station
 * @returns Mutation result for deleting a station
 */
export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => stationsApi.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['stations-with-metrics'] });
    },
  });
};
