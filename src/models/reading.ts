import type { NozzleReading } from '@/api/api-contract';

export interface ReadingModel extends NozzleReading {
  volume: number;
  amount?: number;
  fuelType?: string;
  paymentMethod?: string;
  pricePerLitre?: number;
  pumpName?: string;
  stationName?: string;
  // Add more computed properties as needed
}

export function createReadingModel(reading: NozzleReading, opts?: {
  pricePerLitre?: number;
  fuelType?: string;
  paymentMethod?: string;
  pumpName?: string;
  stationName?: string;
}): ReadingModel {
  const volume = reading.reading - (reading.previousReading ?? 0);
  const amount = opts?.pricePerLitre ? volume * opts.pricePerLitre : undefined;
  return {
    ...reading,
    volume,
    amount,
    fuelType: opts?.fuelType,
    paymentMethod: opts?.paymentMethod,
    pricePerLitre: opts?.pricePerLitre,
    pumpName: opts?.pumpName,
    stationName: opts?.stationName,
  };
}
