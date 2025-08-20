export async function exportSalesCSV(filters: any) {
  // Use the backend contract for CSV export
  const response = await reportsService.generateReport({
    type: 'sales',
    format: 'csv',
    ...filters
  });
  if (typeof response === 'string') {
    const fetchResponse = await fetch(response);
    return await fetchResponse.blob();
  } else if (response && typeof response === 'object') {
    return new Blob([JSON.stringify(response)], { type: 'application/json' });
  }
  return new Blob([JSON.stringify(response || {})], { type: 'application/octet-stream' });
}
export async function scheduleReport(scheduleData: any) {
  return reportsService.scheduleReport(scheduleData);
}
// reportService.ts
// Handles business logic for exporting and scheduling reports
import { reportsService } from '@/api/services/reports.service';

export async function exportReport(exportData: any) {
  const response = await reportsService.generateReport(exportData);
  let blob: Blob;
  if (typeof response === 'string') {
    const fetchResponse = await fetch(response);
    blob = await fetchResponse.blob();
  } else if (response && typeof response === 'object') {
    blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
  } else {
    blob = new Blob([JSON.stringify(response || {})], { type: 'application/octet-stream' });
  }
  return blob;
}
