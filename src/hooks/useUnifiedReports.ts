import { useQuery, useMutation } from '@tanstack/react-query';
import { getSalesReport, getSalesReportSummary, exportSalesReport, exportReport } from '../api/unified-reports';
import type { SalesReportFilters, ExportRequest } from '../../contract/salesReport';

export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => getSalesReport(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalesReportSummary = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report-summary', filters],
    queryFn: () => getSalesReportSummary(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExportSalesReport = () => {
  return useMutation({
    mutationFn: (filters: SalesReportFilters & { format: 'csv' | 'excel' | 'pdf' }) => exportSalesReport(filters),
  });
};

export const useExportReport = () => {
  return useMutation({
  mutationFn: (request: ExportRequest) => exportReport(request),
  });
};
