export interface NozzleInput {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

const ALLOWED_FUEL_TYPES = ['petrol', 'diesel', 'premium'];
const ALLOWED_STATUSES = ['active', 'inactive', 'maintenance'];

export function validateCreateNozzle(data: any): NozzleInput {
  const { pumpId, nozzleNumber, fuelType, status } = data || {};
  if (!pumpId || typeof pumpId !== 'string') {
    throw new Error('pumpId required');
  }
  if (!nozzleNumber || typeof nozzleNumber !== 'number') {
    throw new Error('nozzleNumber required');
  }
  if (!fuelType || typeof fuelType !== 'string') {
    throw new Error('fuelType required');
  }
  if (!ALLOWED_FUEL_TYPES.includes(fuelType)) {
    throw new Error(
      `fuelType must be one of ${ALLOWED_FUEL_TYPES.join(', ')}`
    );
  }

  const result: NozzleInput = {
    pumpId,
    nozzleNumber,
    fuelType: fuelType as 'petrol' | 'diesel' | 'premium'
  };

  if (status !== undefined) {
    if (typeof status !== 'string') {
      throw new Error('status must be a string');
    }
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error(
        `status must be one of ${ALLOWED_STATUSES.join(', ')}`
      );
    }
    result.status = status as 'active' | 'inactive' | 'maintenance';
  }

  return result;
}

export function validateUpdateNozzle(data: any) {
  const { fuelType, status } = data || {};
  if (fuelType !== undefined) {
    if (typeof fuelType !== 'string' || !ALLOWED_FUEL_TYPES.includes(fuelType)) {
      throw new Error(`fuelType must be one of ${ALLOWED_FUEL_TYPES.join(', ')}`);
    }
  }
  if (status !== undefined) {
    if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status)) {
      throw new Error(`status must be one of ${ALLOWED_STATUSES.join(', ')}`);
    }
  }
  return { fuelType, status };
}
