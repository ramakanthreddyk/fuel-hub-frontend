
import { useQuery } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';

export const useStations = (includeMetrics = false) => {
  return useQuery({
    queryKey: ['stations', includeMetrics],
    queryFn: () => stationsApi.getStations(includeMetrics),
    staleTime: 0, // Always consider data stale
    cacheTime: 1000, // Short cache time
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useStationsWithMetrics = () => {
  return useStations(true);
};
