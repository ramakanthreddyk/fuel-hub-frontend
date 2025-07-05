export interface SalesQuery {
  stationId?: string;
  nozzleId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export function parseSalesQuery(query: any): SalesQuery {
  const { stationId, nozzleId, startDate, endDate, page, limit } = query || {};
  const result: SalesQuery = {};
  if (stationId && typeof stationId === 'string') {
    result.stationId = stationId;
  }
  if (nozzleId && typeof nozzleId === 'string') {
    result.nozzleId = nozzleId;
  }
  if (startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) result.startDate = d;
  }
  if (endDate) {
    const d = new Date(endDate);
    if (!isNaN(d.getTime())) result.endDate = d;
  }
  if (page) {
    const p = parseInt(page as any);
    if (!isNaN(p) && p > 0) result.page = p;
  }
  if (limit) {
    const l = parseInt(limit as any);
    if (!isNaN(l) && l > 0) result.limit = l;
  }
  return result;
}
