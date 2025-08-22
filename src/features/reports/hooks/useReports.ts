
import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import { SalesReportFilters } from '../../contract/salesReport';

export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => reportsApi.getSalesReport(filters),
  enabled: !!(filters.dateFrom && filters.dateTo),
  });
};

export const useReportExport = () => {
  const exportMutation = useMutation({
    mutationFn: reportsApi.exportReport,
  });

  const scheduleMutation = useMutation({
    mutationFn: reportsApi.scheduleReport,
  });

  return {
    exportReport: exportMutation.mutateAsync,
    scheduleReport: scheduleMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
};

export const useExportSalesReport = (filters: SalesReportFilters) => {
  return useMutation({
    mutationFn: () => reportsApi.exportSalesReport(filters),
  });
};
