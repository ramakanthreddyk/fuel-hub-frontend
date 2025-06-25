import { useQuery } from '@tanstack/react-query';
import { tenantsApi } from '@/api/tenants';

export const useTenantDetails = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-details', tenantId],
    queryFn: () => tenantsApi.getTenantDetails(tenantId),
    enabled: !!tenantId,
  });
};
