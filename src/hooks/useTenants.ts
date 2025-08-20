import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '../api/tenants';
import type { CreateTenantRequest, UpdateTenantRequest } from '../api/api-contract';

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getTenants,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTenantDetails = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-details', tenantId],
    queryFn: () => tenantsApi.getTenantDetails(tenantId),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsApi.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, updates }: { tenantId: string; updates: UpdateTenantRequest }) => tenantsApi.updateTenant(tenantId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, status }: { tenantId: string; status: 'active' | 'suspended' | 'cancelled' | 'trial' }) => tenantsApi.updateTenantStatus(tenantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useUpdateTenantPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, planId }: { tenantId: string; planId: string }) => tenantsApi.updateTenantPlan(tenantId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => tenantsApi.deleteTenant(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
