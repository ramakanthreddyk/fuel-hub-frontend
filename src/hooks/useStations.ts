
import { useQuery } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: stationsApi.getStations,
  });
};
