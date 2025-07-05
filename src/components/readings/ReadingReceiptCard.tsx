
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Pencil,
  TrendingUp,
  TrendingDown,
  Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatReading, formatDateTime } from '@/utils/formatters';

interface ReadingReceiptCardProps {
  reading: {
    id: string;
    pumpName?: string;
    nozzleNumber?: number;
    stationName?: string;
    reading?: number;
    previousReading?: number;
    status?: string;
    recordedBy?: string;
    recordedAt: string;
    fuelType?: string;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ReadingReceiptCard({ reading, onView, onEdit }: ReadingReceiptCardProps) {
  const getStatusConfig = () => {
    switch (reading.status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock,
          label: 'Pending'
        };
      case 'discrepancy':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: AlertTriangle,
          label: 'Discrepancy'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertTriangle,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  
  const currentReading = reading.reading || 0;
  const previousReading = reading.previousReading || 0;
  const difference = currentReading - previousReading;
  const isLargeJump = difference > previousReading * 0.2;

  return (
    <Card className="relative overflow-hidden bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Receipt Header */}
      <div className="bg-gray-50 border-b border-dashed border-gray-300 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-mono text-lg font-bold text-gray-900">
              {reading.pumpName
                ? `${reading.pumpName} – Nozzle #${
                    reading.nozzleNumber ?? 'N/A'
                  }`
                : `Nozzle #${reading.nozzleNumber ?? 'N/A'}`}
            </h3>
            <p className="text-sm text-gray-600">{reading.stationName}</p>
            <p className="text-xs text-gray-500">
              Recorded by: {reading.recordedBy || 'UNKNOWN'}
            </p>
          </div>
          
          <Badge className={cn("text-xs font-semibold", statusConfig.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Reading Details */}
        <div className="space-y-3 mb-4 font-mono">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">CURRENT READING:</span>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-lg text-gray-900">{formatReading(currentReading)}L</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">PREVIOUS:</span>
            <span className="font-semibold text-gray-700">{formatReading(previousReading)}L</span>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border">
            <span className="text-gray-700 font-semibold text-sm">DIFFERENCE:</span>
            <div className="flex items-center gap-2">
              {difference > 0 ? (
                <TrendingUp className={cn("w-4 h-4", isLargeJump ? "text-red-500" : "text-green-500")} />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={cn(
                "font-bold",
                isLargeJump ? "text-red-600" : "text-green-600"
              )}>
                +{formatReading(difference)}L
              </span>
            </div>
          </div>

          {isLargeJump && (
            <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 px-3 py-2 rounded border border-orange-200">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">LARGE JUMP DETECTED</span>
            </div>
          )}

          {reading.fuelType && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">FUEL TYPE:</span>
              <span className="font-semibold text-gray-900 uppercase">{reading.fuelType}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dashed border-gray-300 pt-4 space-y-2 text-xs text-gray-600 font-mono">
          <div>{formatDateTime(reading.recordedAt)}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onView(reading.id)} className="flex-1">
            <Eye className="w-3 h-3 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(reading.id)} className="flex-1">
            <Pencil className="w-3 h-3 mr-2" />
            Edit Reading
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
