/**
 * @file hooks/api/useCreditors.ts
 * @description React Query hooks for creditors API
 */
import { useQuery } from '@tanstack/react-query';
import { creditorsService } from '@/api/services/creditors.service';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to fetch creditors for a station
 * @param stationId Station ID (optional)
 * @returns Query result with creditors
 */
export const useCreditors = (stationId?: string) => {
  const { handleApiError } = useToastNotifications();
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['creditors', stationId],
    queryFn: () => creditorsService.getCreditors(stationId),
    enabled: user?.role === 'owner' || user?.role === 'manager',
    staleTime: 60000,
  });
  
  useAutoLoader(query.isLoading, 'Loading creditors...');
  return query;
};

/**
 * Hook to fetch a creditor by ID
 * @param id Creditor ID
 * @returns Query result with creditor details
 */
export const useCreditor = (id?: string) => {
  const { handleApiError } = useToastNotifications();
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorsService.getCreditor(id || ''),
    enabled: !!id && (user?.role === 'owner' || user?.role === 'manager'),
    staleTime: 0, // Force fresh data
  });
  
  useAutoLoader(query.isLoading, 'Loading creditor details...');
  return query;
};