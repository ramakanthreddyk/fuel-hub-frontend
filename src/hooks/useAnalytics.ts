
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';

export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: ['superadmin-analytics'],
    queryFn: analyticsApi.getSuperAdminAnalytics,
  });
};
