/**
 * @file ReadingDetailPage.tsx
 * @description Page for viewing reading details
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Fuel, Building2, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { useReading } from '@/hooks/api/useReadings';
import { VoidReadingDialog } from '@/components/readings/VoidReadingDialog';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatVolume, formatDateTime } from '@/utils/formatters';

export default function ReadingDetailPage() {
  const { readingId } = useParams<{ readingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  
  const { data: reading, isLoading, error } = useReading(readingId || '');
  
  // Debug log to see what's coming from the API
  console.log('[READING-DETAIL] Reading data from API:', reading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading reading details...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading reading details</p>
        <Button onClick={() => navigate('/dashboard/readings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Readings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/readings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Readings
        </Button>
        <h1 className="text-2xl font-bold">Reading Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Station</label>
              <p className="font-medium">{reading.stationName || 'Unknown Station'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pump</label>
              <p className="font-medium">{reading.pumpName || 'Unknown Pump'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nozzle</label>
              <p className="font-medium">#{reading.nozzleNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
              <Badge className="mt-1">{reading.fuelType || 'Unknown'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Reading Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Reading</label>
              <p className="text-2xl font-bold">{typeof reading.reading === 'number' ? reading.reading : Number(reading.reading)}L</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Previous Reading</label>
              <p className="font-medium">{reading.previousReading ? (typeof reading.previousReading === 'number' ? reading.previousReading : Number(reading.previousReading)) : '0'}L</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Volume Sold</label>
              <p className="text-xl font-bold text-green-600">
                {Number(reading.reading || 0) - Number(reading.previousReading || 0)} Liters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Sales Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fuel Price</label>
              <div className="flex items-center gap-2">
                <p className="font-medium">{formatCurrency(reading.pricePerLitre || 0)}/L</p>
                {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Backdated Reading
                  </Badge>
                )}
              </div>
              {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') && (
                <p className="text-xs text-amber-600 mt-1">
                  This reading was likely recorded before a fuel price was set, or the price was not found for this date.
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
              <p className="text-2xl font-bold text-green-600">
                {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') ? (
                  <span className="text-amber-600">
                    {formatCurrency((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * 100)}
                    <span className="text-xs text-amber-500 ml-2">(estimated at ₹100/L)</span>
                  </span>
                ) : (
                  <>
                    {formatCurrency(
                      // Calculate amount from reading and price if amount is missing
                      reading.amount !== undefined && reading.amount !== null ? reading.amount : 
                      ((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * Number(reading.pricePerLitre || 0))
                    )}
                    {reading.amount === null && 
                      <span className="text-xs text-gray-500 ml-2">(calculated)</span>
                    }
                  </>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <Badge variant="outline">{reading.paymentMethod || 'Cash'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Recorded At</label>
              <p className="font-medium">{formatDateTime(reading.recordedAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Recorded By</label>
              <p className="font-medium">{reading.recordedBy || 'System'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {/* Only show void button for managers and owners */}
        {(user?.role === 'manager' || user?.role === 'owner') && (
          <Button 
            variant="destructive" 
            onClick={() => setVoidDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Void Reading
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate('/dashboard/readings')}>
          Back to List
        </Button>
      </div>
      
      {/* Void Reading Dialog */}
      <VoidReadingDialog 
        readingId={readingId || ''}
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onSuccess={() => navigate('/dashboard/readings')}
      />
    </div>
  );
}
