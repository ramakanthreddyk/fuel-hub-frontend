export interface StationInput {
  name: string;
  address?: string;
}

export function validateCreateStation(data: any): StationInput {
  const { name, address } = data || {};
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid station name');
  }
  return { name, address };
}

export function validateUpdateStation(data: any): StationInput {
  const { name } = data || {};
  if (!name) {
    throw new Error('No update fields');
  }
  return { name };
}
