import { useQuery } from '@tanstack/react-query';
import { superadminApi } from '@/api/superadmin';

export const useTenantDetails = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-details', tenantId],
    queryFn: () => superadminApi.getTenant(tenantId),
    enabled: !!tenantId,
  });
};
