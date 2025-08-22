export function getFuelTypeColor(fuelType?: string): string {
  switch (fuelType?.toLowerCase()) {
    case 'petrol':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'diesel':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'premium':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

export function getPaymentMethodColor(paymentMethod?: string): string {
  switch (paymentMethod?.toLowerCase()) {
    case 'cash':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'card':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'upi':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'credit':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getReadingStatusLabel(reading: number, previousReading?: number): string {
  if (previousReading === undefined) return 'First Reading';
  if (reading > previousReading) return 'Normal';
  if (reading < previousReading) return 'Meter Reset';
  return 'No Change';
}
