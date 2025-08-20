import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi } from '../api/superadmin';
import type { CreateTenantRequest, CreatePlanRequest } from '../api/api-contract';

export const useSuperAdminTenants = () => {
  return useQuery({
    queryKey: ['superadmin-tenants'],
    queryFn: superAdminApi.getTenants,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSuperAdminTenant = (tenantId: string) => {
  return useQuery({
    queryKey: ['superadmin-tenant', tenantId],
    queryFn: () => superAdminApi.getTenant(tenantId),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateSuperAdminTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) => superAdminApi.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenants'] });
    },
  });
};

export const useUpdateSuperAdminTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, updates }: { tenantId: string; updates: Partial<any> }) => superAdminApi.updateTenant(tenantId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenants'] });
    },
  });
};

export const useDeleteSuperAdminTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => superAdminApi.deleteTenant(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenants'] });
    },
  });
};

export const useSuperAdminPlans = () => {
  return useQuery({
    queryKey: ['superadmin-plans'],
    queryFn: superAdminApi.getPlans,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateSuperAdminPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanRequest) => superAdminApi.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-plans'] });
    },
  });
};

export const useUpdateSuperAdminPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, updates }: { planId: string; updates: Partial<any> }) => superAdminApi.updatePlan(planId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-plans'] });
    },
  });
};

export const useDeleteSuperAdminPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => superAdminApi.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-plans'] });
    },
  });
};

export const useSuperAdminSummary = () => {
  return useQuery({
    queryKey: ['superadmin-summary'],
    queryFn: superAdminApi.getSummary,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: superAdminApi.getAnalytics,
    staleTime: 10 * 60 * 1000,
  });
};
