
import { useQuery } from '@tanstack/react-query';
import { useFuelPrices } from './useFuelPrices';
import { useStations } from './useStations';

export const useFuelPricesWithStations = () => {
  const { data: fuelPrices = [], isLoading: pricesLoading, error: pricesError } = useFuelPrices();
  const { data: stations = [], isLoading: stationsLoading, error: stationsError } = useStations();

  return useQuery({
    queryKey: ['fuel-prices-with-stations', fuelPrices, stations],
    queryFn: () => {
      // Enrich fuel prices with station names
      return fuelPrices.map(price => ({
        ...price,
        stationName: stations.find(station => station.id === price.stationId)?.name || 'Unknown Station'
      }));
    },
    enabled: !pricesLoading && !stationsLoading && fuelPrices.length > 0,
    staleTime: 30000,
  });
};
