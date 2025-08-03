/**
 * @file components/readings/ReadingCard.tsx
 * @description Card component for displaying a reading
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gauge, Clock, Eye, Droplets, Fuel, DollarSign } from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/utils/formatters';
import { formatDisplayDateTime, debugDateValue } from '@/utils/dateHelpers';
import { cn } from '@/lib/utils';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsivePadding
} from '@/utils/mobileFormatters';

interface ReadingCardProps {
  reading: {
    id: string;
    nozzleId?: string;
    nozzleNumber?: number;
    reading: number;
    previousReading?: number;
    recordedAt: string;
    paymentMethod?: string;
    fuelType?: string;
    pumpName?: string;
    stationName?: string;
    amount?: number;
    volume?: number;
    pricePerLitre?: number;
  };
  onView: (id: string) => void;
}

export function ReadingCard({ reading, onView }: ReadingCardProps) {
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();

  // Calculate amount if not provided
  const calculatedAmount = reading.amount !== undefined ? reading.amount :
                          reading.volume !== undefined && reading.pricePerLitre !== undefined ?
                          reading.volume * reading.pricePerLitre :
                          reading.reading !== undefined && reading.previousReading !== undefined && reading.pricePerLitre !== undefined ?
                          (reading.reading - reading.previousReading) * reading.pricePerLitre : undefined;

  // Calculate volume if not provided
  const calculatedVolume = reading.volume !== undefined ? reading.volume :
                          reading.reading !== undefined && reading.previousReading !== undefined ?
                          reading.reading - reading.previousReading : undefined;
  
  // Get fuel type color
  const getFuelTypeColor = () => {
    switch (reading.fuelType?.toLowerCase()) {
      case 'petrol':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'diesel':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get payment method color
  const getPaymentMethodColor = () => {
    switch (reading.paymentMethod?.toLowerCase()) {
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
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 bg-white">
      <div className={cn(
        "h-1.5 w-full",
        reading.fuelType?.toLowerCase() === 'petrol' ? 'bg-emerald-500' :
        reading.fuelType?.toLowerCase() === 'diesel' ? 'bg-amber-500' :
        reading.fuelType?.toLowerCase() === 'premium' ? 'bg-purple-500' : 'bg-blue-500'
      )} />
      <CardContent className={getResponsivePadding('base')}>
        {isMobile ? (
          // Mobile: Compact layout
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h3 className={`${getResponsiveTextSize('sm')} font-semibold text-gray-900 truncate`}>
                  {reading.nozzleNumber ? `Nozzle #${reading.nozzleNumber}` : 'Nozzle'}
                </h3>
                <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                  {reading.pumpName && reading.stationName ?
                    `${reading.stationName} - ${reading.pumpName}` :
                    reading.pumpName || reading.stationName || 'Unknown location'}
                </p>
              </div>
              {reading.fuelType && (
                <Badge variant="outline" className={`${getFuelTypeColor()} text-xs ml-2 flex-shrink-0`}>
                  {reading.fuelType}
                </Badge>
              )}
            </div>

            {/* Mobile: 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Gauge className="h-2 w-2" />
                  Reading
                </div>
                <div className="font-mono text-xs font-semibold text-gray-900">
                  {isMobile ? formatCurrencyMobile(reading.reading) : reading.reading.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Droplets className="h-2 w-2" />
                  Volume
                </div>
                <div className="font-mono text-xs font-semibold text-gray-900">
                  {calculatedVolume !== undefined ?
                    `${isMobile ? formatCurrencyMobile(calculatedVolume) : calculatedVolume.toLocaleString()}L` :
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <DollarSign className="h-2 w-2" />
                  Amount
                </div>
                <div className="font-mono text-xs font-semibold text-green-700">
                  {calculatedAmount !== undefined ?
                    (isMobile ? formatCurrencyMobile(calculatedAmount) : formatCurrency(calculatedAmount)) :
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock className="h-2 w-2" />
                  Date
                </div>
                <div className="text-xs text-gray-700">
                  {formatDisplayDateTime(reading.recordedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {reading.paymentMethod && (
                <Badge variant="outline" className={`${getPaymentMethodColor()} text-xs`}>
                  {reading.paymentMethod}
                </Badge>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(reading.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2 py-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        ) : (
          // Desktop: Original layout
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {reading.nozzleNumber ? `Nozzle #${reading.nozzleNumber}` : 'Nozzle'}
                </h3>
                <p className="text-xs text-gray-500">
                  {reading.pumpName && reading.stationName ?
                    `${reading.stationName} - ${reading.pumpName}` :
                    reading.pumpName || reading.stationName || 'Unknown location'}
                </p>
              </div>
              {reading.fuelType && (
                <Badge variant="outline" className={getFuelTypeColor()}>
                  <Fuel className="h-3 w-3 mr-1" />
                  {reading.fuelType}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Gauge className="h-3 w-3" />
                  Reading
                </div>
                <div className="font-mono font-semibold text-gray-900">
                  {reading.reading.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Droplets className="h-3 w-3" />
                  Volume
                </div>
                <div className="font-mono font-semibold text-gray-900">
                  {calculatedVolume !== undefined ?
                    `${calculatedVolume.toLocaleString()} L` :
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <DollarSign className="h-3 w-3" />
                  Amount
                </div>
                <div className="font-mono font-semibold text-green-700">
                  {calculatedAmount !== undefined ?
                    formatCurrency(calculatedAmount) :
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock className="h-3 w-3" />
                  Date
                </div>
                <div className="text-xs text-gray-700">
                  {formatDisplayDateTime(reading.recordedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {reading.paymentMethod && (
                <Badge variant="outline" className={getPaymentMethodColor()}>
                  {reading.paymentMethod}
                </Badge>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(reading.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}