
import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import { SalesReportFilters, SalesReportExportFilters } from '@/api/api-contract';

export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => reportsApi.getSalesReport(filters),
    enabled: !!(filters.startDate && filters.endDate),
  });
};

export const useReportExport = () => {
  return useMutation({
    mutationFn: reportsApi.exportReport,
  });
};

export const useScheduleReport = () => {
  return useMutation({
    mutationFn: reportsApi.scheduleReport,
  });
};

export const useExportSalesReport = (filters: SalesReportExportFilters) => {
  return useMutation({
    mutationFn: () => reportsApi.exportSalesReport(filters),
  });
};
