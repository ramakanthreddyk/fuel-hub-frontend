export function normalizeStationId(id?: string): string | undefined {
  if (!id) return undefined;
  const cleaned = id.trim().toLowerCase();
  if (!cleaned || cleaned === 'all' || cleaned === 'undefined' || cleaned === 'null') {
    return undefined;
  }
  return id;
}
