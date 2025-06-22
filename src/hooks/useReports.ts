
import { useQuery } from '@tanstack/react-query';
import { reportsApi, SalesReportFilters } from '@/api/reports';

export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => reportsApi.getSalesReport(filters),
    enabled: !!(filters.startDate && filters.endDate),
  });
};
