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
import { getFuelTypeColor, getPaymentMethodColor } from '@/utils/reading-config';
import type { ReadingModel } from '@/models/reading';
import type { ReadingCardActions } from '@/models/reading-actions';

interface ReadingCardProps {
  reading: ReadingModel;
  actions: ReadingCardActions;
  onView?: (id: string) => void; // Added onView property
}

export function ReadingCard({ reading, actions }: ReadingCardProps) {
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();
  const fuelTypeColor = getFuelTypeColor(reading.fuelType);
  const paymentMethodColor = getPaymentMethodColor(reading.paymentMethod);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 bg-white">
      <div className={cn("h-1.5 w-full", fuelTypeColor.replace(/text-[^ ]+|border-[^ ]+/g, '').trim())} />
      <CardContent className={getResponsivePadding('base')}>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <h3 className={`${getResponsiveTextSize('sm')} font-semibold text-gray-900 truncate`}>
                {reading.nozzleId ? `Nozzle` : 'Nozzle'}
              </h3>
              <p className={`${getResponsiveTextSize('xs')} text-gray-500 truncate`}>
                {reading.pumpName && reading.stationName ? `${reading.stationName} - ${reading.pumpName}` : reading.pumpName || reading.stationName || 'Unknown location'}
              </p>
            </div>
            {reading.fuelType && (
              <Badge variant="outline" className={`${fuelTypeColor} text-xs ml-2 flex-shrink-0`}>
                {reading.fuelType}
              </Badge>
            )}
          </div>
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
                {reading.volume !== undefined ? reading.volume.toLocaleString() : '-'}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded border border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <DollarSign className="h-2 w-2" />
                Amount
              </div>
              <div className="font-mono text-xs font-semibold text-gray-900">
                {reading.amount !== undefined ? formatCurrency(reading.amount) : '-'}
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
              <Badge variant="outline" className={`${paymentMethodColor} text-xs`}>
                {reading.paymentMethod}
              </Badge>
            )}
            {actions.onView && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => actions.onView?.(reading.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2 py-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}