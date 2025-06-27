
import { useQuery } from '@tanstack/react-query';
import { superadminApi } from '@/api/superadmin';
import { tenantsApi } from '@/api/tenants';
import { usersApi } from '@/api/users';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['superadmin-summary'],
    queryFn: superadminApi.getSummary
  });
}

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getTenants
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ['admin-plans'],
    queryFn: superadminApi.getPlans
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['superadmin-users'],
    queryFn: superadminApi.getAdminUsers
  });
}
