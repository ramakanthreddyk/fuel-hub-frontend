import { useQuery } from '@tanstack/react-query';
import { superAdminApi } from '@/api/superadmin';

export const useTenantDetails = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-details', tenantId],
    queryFn: () => superAdminApi.getTenant(tenantId),
    enabled: !!tenantId,
  });
};
