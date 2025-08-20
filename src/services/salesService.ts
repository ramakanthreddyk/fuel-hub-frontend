// salesService.ts
// Handles business logic for fetching sales data for a nozzle
export async function fetchSales(nozzleId: string, from: string, to: string) {
  if (!nozzleId || !from || !to) {
    return [];
  }
  const response = await fetch(`/api/sales?nozzleId=${nozzleId}&from=${from}&to=${to}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales data');
  }
  return response.json();
}
