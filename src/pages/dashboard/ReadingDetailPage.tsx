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
import { useMobileFormatters, getResponsiveTextSize, getResponsiveIconSize, getResponsivePadding } from '@/utils/mobileFormatters';

export default function ReadingDetailPage() {
  const { readingId } = useParams<{ readingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();

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
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Mobile-friendly Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/readings')}
              className={`${getResponsiveTextSize('sm')} flex-shrink-0`}
            >
              <ArrowLeft className={`${getResponsiveIconSize('xs')} mr-1 sm:mr-2`} />
              <span className="hidden xs:inline">Back to Readings</span>
              <span className="xs:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className={`${getResponsiveTextSize('xl')} font-bold text-gray-900 truncate`}>
                Reading Details
              </h1>
              <p className={`${getResponsiveTextSize('sm')} text-gray-600`}>
                {reading?.stationName} • {reading?.pumpName} • N{reading?.nozzleNumber}
              </p>
            </div>
          </div>
        </div>

        {isMobile ? (
          // Mobile: Single column layout with compact cards
          <div className="space-y-4">
            {/* Mobile: Compact Overview Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-2">Location & Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-blue-600">Station</p>
                        <p className="font-medium text-blue-900 truncate">{reading.stationName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Pump</p>
                        <p className="font-medium text-blue-900 truncate">{reading.pumpName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Nozzle</p>
                        <p className="font-medium text-blue-900">#{reading.nozzleNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Fuel Type</p>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                          {reading.fuelType || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile: Reading Information Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Fuel className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-green-900 mb-3">Reading Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-green-600">Current Reading</p>
                          <p className="text-lg font-bold text-green-900">
                            {isMobile ? formatCurrencyMobile(Number(reading.reading || 0)) : (Number(reading.reading || 0)).toLocaleString()}L
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">Previous Reading</p>
                          <p className="font-medium text-green-800">
                            {isMobile ? formatCurrencyMobile(Number(reading.previousReading || 0)) : (Number(reading.previousReading || 0)).toLocaleString()}L
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 text-center">
                        <p className="text-xs text-green-600">Volume Sold</p>
                        <p className="text-xl font-bold text-green-800">
                          {Number(reading.reading || 0) - Number(reading.previousReading || 0)} Liters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile: Sales Information Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-purple-900 mb-3">Sales Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-purple-600">Fuel Price</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-purple-900">
                            {isMobile ? formatCurrencyMobile(reading.pricePerLitre || 0) : formatCurrency(reading.pricePerLitre || 0)}/L
                          </p>
                          {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              <AlertTriangle className="h-2 w-2 mr-1" />
                              Backdated
                            </Badge>
                          )}
                        </div>
                        {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') && (
                          <p className="text-xs text-amber-600 mt-1">
                            Price not set for this date
                          </p>
                        )}
                      </div>
                      <div className="bg-purple-100 rounded-lg p-3 text-center">
                        <p className="text-xs text-purple-600">Total Amount</p>
                        {(reading.pricePerLitre === 0 || reading.pricePerLitre === '0') ? (
                          <span className="text-amber-600">
                            {isMobile ? formatCurrencyMobile((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * 100) : formatCurrency((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * 100)}
                            <span className="text-xs text-amber-500 block">(estimated at ₹100/L)</span>
                          </span>
                        ) : (
                          <>
                            {isMobile ? formatCurrencyMobile(
                              reading.amount !== undefined && reading.amount !== null ? reading.amount :
                              ((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * Number(reading.pricePerLitre || 0))
                            ) : formatCurrency(
                              reading.amount !== undefined && reading.amount !== null ? reading.amount :
                              ((Number(reading.reading || 0) - Number(reading.previousReading || 0)) * Number(reading.pricePerLitre || 0))
                            )}
                            {reading.amount === null &&
                              <span className="text-xs text-purple-500 block">(calculated)</span>
                            }
                          </>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-purple-600">Payment Method</p>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                          {reading.paymentMethod || 'Cash'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile: Record Information Card */}
            <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-3">Record Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Recorded At</p>
                        <p className="font-medium text-gray-900 text-sm">{formatDateTime(reading.recordedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Recorded By</p>
                        <p className="font-medium text-gray-900 text-sm">{reading.recordedBy || 'System'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile: Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {(user?.role === 'manager' || user?.role === 'owner') && (
                <Button
                  variant="destructive"
                  onClick={() => setVoidDialogOpen(true)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Void Reading
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/readings')}
                className="w-full"
              >
                Back to List
              </Button>
            </div>
          </div>
        ) : (
          // Desktop: Original grid layout
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
                  <Badge variant="outline">{reading.fuelType || 'Unknown'}</Badge>
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
                  <p className="text-xl font-semibold text-green-600">
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
        )}

        {/* Desktop Action Buttons */}
        {!isMobile && (
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
        )}

        {/* Void Reading Dialog */}
        <VoidReadingDialog
          readingId={readingId || ''}
          open={voidDialogOpen}
          onOpenChange={setVoidDialogOpen}
          onSuccess={() => navigate('/dashboard/readings')}
        />
      </div>
    </div>
  );
}
