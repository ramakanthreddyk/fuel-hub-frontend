import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReading } from '@/hooks/api/useReadings';
import { formatDateTime, formatReading } from '@/utils/formatters';

export default function ReadingDetailPage() {
  const { readingId } = useParams<{ readingId: string }>();
  const { data: reading, isLoading, error } = useReading(readingId || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="mb-4">Unable to load reading details.</p>
        <Button asChild>
          <Link to="/dashboard/readings">
            <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/readings">
            <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Reading Details</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nozzle {reading.nozzleNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Station: {reading.stationName}</div>
          <div>Pump: {reading.pumpName}</div>
          <div>Reading: {formatReading(reading.reading)}L</div>
          {reading.previousReading !== undefined && (
            <div>Previous: {formatReading(reading.previousReading)}L</div>
          )}
          <div>Recorded At: {formatDateTime(reading.recordedAt)}</div>
          <div>Payment: {reading.paymentMethod}</div>
        </CardContent>
      </Card>
    </div>
  );
}
