
/**
 * @file hooks/api/useStations.ts
 * @description React Query hooks for stations API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi, CreateStationData, UpdateStationData } from '@/api/stations';

/**
 * Hook to fetch all stations or a specific station
 * @returns Query result with stations data
 */
export const useStations = (stationId?: string) => {
  return useQuery({
    queryKey: stationId ? ['station', stationId] : ['stations'],
    queryFn: () => {
      if (stationId) {
        return stationsApi.getStation(stationId);
      } else {
        return stationsApi.getStations();
      }
    },
    staleTime: 60000, // 1 minute
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
    staleTime: 60000, // 1 minute
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
    },
  });
};
