
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Clock, Eye } from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/utils/formatters';

interface ReadingCardProps {
  reading: {
    id: string;
    nozzleNumber?: number;
    fuelType?: string;
    reading: number;
    amount?: number;
    recordedAt: string;
    status?: string;
    stationName?: string;
    pumpName?: string;
  };
  onView?: (id: string) => void;
}

export function ReadingCard({ reading, onView }: ReadingCardProps) {
  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType?.toLowerCase()) {
      case 'petrol':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'diesel':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Nozzle #{reading.nozzleNumber || 'N/A'}
          </CardTitle>
          {reading.fuelType && (
            <Badge className={getFuelTypeColor(reading.fuelType)}>
              {reading.fuelType}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {reading.reading.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Meter Reading</div>
        </div>
        
        {reading.amount && (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(reading.amount)}
            </div>
            <div className="text-xs text-gray-500">Amount</div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{formatDateTime(reading.recordedAt)}</span>
        </div>

        <div className="flex gap-1">
          {onView && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-7 text-xs"
              onClick={() => onView(reading.id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
