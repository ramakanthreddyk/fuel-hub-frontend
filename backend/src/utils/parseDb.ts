export function parseValue(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val) && !isNaN(Date.parse(val))) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
    }
    const n = Number(val);
    if (!isNaN(n)) return n;
  }
  return val;
}

export function parseRow<T extends Record<string, any>>(row: T): T {
  if (!row) return row;
  const parsed: any = {};
  for (const [k, v] of Object.entries(row)) {
    parsed[k] = parseValue(v);
  }
  return parsed;
}

export function parseRows<T extends Record<string, any>>(rows: T[]): T[] {
  return rows.map(r => parseRow(r));
}
