export interface PumpInput {
  stationId: string;
  name: string;
  serialNumber: string;
}

export function validateCreatePump(data: any): PumpInput {
  const { stationId, name, serialNumber } = data || {};
  if (!stationId || typeof stationId !== 'string') {
    throw new Error('stationId required');
  }
  if (!name || typeof name !== 'string') {
    throw new Error('name required');
  }
  if (!serialNumber || typeof serialNumber !== 'string') {
    throw new Error('serialNumber required');
  }
  return { stationId, name, serialNumber };
}

export function validateUpdatePump(data: any) {
  const { name, serialNumber } = data || {};
  if (name !== undefined && typeof name !== 'string') {
    throw new Error('name must be a string');
  }
  if (serialNumber !== undefined && typeof serialNumber !== 'string') {
    throw new Error('serialNumber must be a string');
  }
  return { name, serialNumber };
}
