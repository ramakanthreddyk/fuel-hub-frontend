import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantSettingsApi } from '../api/tenant-settings';

export const useTenantSettings = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-settings', tenantId],
    queryFn: () => tenantSettingsApi.getTenantSettings(tenantId),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateTenantSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, key, value }: { tenantId: string; key: string; value: string }) => tenantSettingsApi.updateTenantSetting(tenantId, key, value),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings', variables.tenantId] });
    },
  });
};

export const useBulkUpdateTenantSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, settings }: { tenantId: string; settings: Record<string, string> }) => tenantSettingsApi.bulkUpdateTenantSettings(tenantId, settings),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings', variables.tenantId] });
    },
  });
};
