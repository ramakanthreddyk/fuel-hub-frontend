
/**
 * Fuel Prices Hook
 * 
 * React Query hooks for fuel price management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import type { CreateFuelPriceRequest, UpdateFuelPriceRequest } from '@/api/api-contract';

export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: () => fuelPricesService.getFuelPrices(stationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFuelPrice = (id: string) => {
  return useQuery({
    queryKey: ['fuel-price', id],
    queryFn: () => fuelPricesService.getFuelPrice(id),
    enabled: !!id,
  });
};

export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateFuelPriceRequest) => fuelPricesService.createFuelPrice(data),
    onSuccess: (newPrice) => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-prices', newPrice.stationId] });
      toast({
        title: "Success",
        description: `${newPrice.fuelType} price updated to ₹${newPrice.price}/L`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update fuel price",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFuelPrice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuelPriceRequest }) => 
      fuelPricesService.updateFuelPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update fuel price",
        variant: "destructive",
      });
    },
  });
};

export const useValidateStationPrices = (stationId: string) => {
  return useQuery({
    queryKey: ['validate-station-prices', stationId],
    queryFn: () => fuelPricesService.validateStationPrices(stationId),
    enabled: !!stationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMissingPrices = () => {
  return useQuery({
    queryKey: ['missing-fuel-prices'],
    queryFn: () => fuelPricesService.getMissingPrices(),
    staleTime: 5 * 60 * 1000,
  });
};
