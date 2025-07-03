/**
 * @file useStations.ts
 * @description React Query hooks for stations API
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService, Station, StationWithMetrics, CreateStationRequest, UpdateStationRequest } from '@/api/services/stationsService';
import { queryOptions } from './useQueryConfig';
import { useErrorHandler } from './useErrorHandler';

/**
 * Hook to fetch all stations
 * @param includeMetrics Whether to include metrics in the response
 * @returns Query result with stations data
 */
export const useStations = (includeMetrics = false) => {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['stations', includeMetrics],
    queryFn: () => stationsService.getStations(includeMetrics),
    ...queryOptions.referenceData,
    onError: (error) => handleError(error, 'Failed to fetch stations'),
  });
};

/**
 * Hook to fetch a station by ID
 * @param id Station ID
 * @returns Query result with station data
 */
export const useStation = (id: string) => {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsService.getStation(id),
    enabled: !!id,
    ...queryOptions.referenceData,
    onError: (error) => handleError(error, `Failed to fetch station ${id}`),
  });
};

/**
 * Hook to create a station
 * @returns Mutation result for creating a station
 */
export const useCreateStation = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: CreateStationRequest) => stationsService.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
    onError: (error) => handleError(error, 'Failed to create station'),
  });
};

/**
 * Hook to update a station
 * @returns Mutation result for updating a station
 */
export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationRequest }) => 
      stationsService.updateStation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
    onError: (error) => handleError(error, 'Failed to update station'),
  });
};

/**
 * Hook to delete a station
 * @returns Mutation result for deleting a station
 */
export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => stationsService.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
    onError: (error) => handleError(error, 'Failed to delete station'),
  });
};