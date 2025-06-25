
import { useQuery } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';

export const useStations = (includeMetrics = false) => {
  return useQuery({
    queryKey: ['stations', includeMetrics],
    queryFn: () => stationsApi.getStations(includeMetrics),
  });
};

export const useStationsWithMetrics = () => {
  return useStations(true);
};
