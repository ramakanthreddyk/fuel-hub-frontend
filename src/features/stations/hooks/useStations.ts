
import { useQuery } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Short cache time
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useStationsWithMetrics = () => {
  return useStations();
};
