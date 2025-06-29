
/**
 * Contract-Aligned Stations Hook
 * 
 * Uses contract-compliant stations service
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsService } from '@/api/contract/stations.service';
import { useToast } from '@/hooks/use-toast';
import type { CreateStationRequest } from '@/api/api-contract';

export const useContractStations = (includeMetrics?: boolean) => {
  return useQuery({
    queryKey: ['contract-stations', includeMetrics],
    queryFn: () => stationsService.getStations(includeMetrics),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContractStation = (stationId: string) => {
  return useQuery({
    queryKey: ['contract-station', stationId],
    queryFn: () => stationsService.getStation(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContractCreateStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateStationRequest) => stationsService.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-stations'] });
      toast({
        title: "Success",
        description: "Station created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create station",
        variant: "destructive",
      });
    },
  });
};

export const useContractUpdateStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ stationId, data }: { stationId: string; data: Partial<CreateStationRequest> }) => 
      stationsService.updateStation(stationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-stations'] });
      queryClient.invalidateQueries({ queryKey: ['contract-station'] });
      toast({
        title: "Success",
        description: "Station updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update station",
        variant: "destructive",
      });
    },
  });
};
