export interface DeliveryInput {
  stationId: string;
  fuelType: string;
  volume: number;
  supplier?: string;
  deliveryDate: Date;
  documentNumber?: string;
}

export interface DeliveryQuery {
  stationId?: string;
}

export function validateCreateDelivery(data: any): DeliveryInput {
  const { stationId, fuelType, volume, supplier, deliveryDate, documentNumber } = data || {};
  if (!stationId || typeof stationId !== 'string') {
    throw new Error('stationId required');
  }
  if (!fuelType || typeof fuelType !== 'string') {
    throw new Error('fuelType required');
  }
  const vol = parseFloat(volume);
  if (isNaN(vol) || vol <= 0) {
    throw new Error('volume must be > 0');
  }
  const date = new Date(deliveryDate);
  if (!deliveryDate || isNaN(date.getTime())) {
    throw new Error('deliveryDate invalid');
  }
  const result: DeliveryInput = { stationId, fuelType, volume: vol, deliveryDate: date };
  if (supplier && typeof supplier === 'string') {
    result.supplier = supplier;
  }
  if (documentNumber && typeof documentNumber === 'string') {
    result.documentNumber = documentNumber;
  }
  return result;
}

export function parseDeliveryQuery(query: any): DeliveryQuery {
  const { stationId } = query || {};
  const result: DeliveryQuery = {};
  if (stationId && typeof stationId === 'string') {
    result.stationId = stationId;
  }
  return result;
}
