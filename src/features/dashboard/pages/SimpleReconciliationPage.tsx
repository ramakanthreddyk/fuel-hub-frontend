import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FuelLoader } from '@/components/ui/FuelLoader';

export default function SimpleReconciliationPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStation, setSelectedStation] = useState('');
  const [systemSales, setSystemSales] = useState(0);
  const [actualCash, setActualCash] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { data: stations = [] } = useStations();
  const { toast } = useToast();

  const variance = actualCash ? Number(actualCash) - systemSales : 0;
  const hasVariance = Math.abs(variance) > 1;
  const isPastDate = new Date(selectedDate) < new Date().setHours(0,0,0,0);

  const loadSystemSales = async () => {
    if (!selectedStation || !selectedDate) return;
    
    setIsLoading(true);
    try {
      const { apiClient } = await import('@/api/client');
      console.log('Fetching daily summary...');
      
      const response = await apiClient.get('/reconciliation/daily-summary', {
        params: {
          stationId: selectedStation,
          date: selectedDate
        }
      });
      
      const data = response.data;
      console.log('Response data:', data);
      
      console.log('API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        if (data.data.length > 0) {
          const total = data.data.reduce((sum: number, item: any) => sum + (item.saleValue || 0), 0);
          setSystemSales(total);
          setActualCash(total.toString());
          setStep(2);
          toast({
            title: "Sales Data Loaded",
            description: `Found ${data.data.length} nozzle readings with total sales of ${formatCurrency(total)}`
          });
        } else {
          toast({
            title: "No Sales Data",
            description: "No nozzle readings found for this date. Add readings first.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Invalid Response",
          description: "Unexpected response format from server",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconcile = async () => {
    if (!selectedStation || !actualCash) return;
    
    if (hasVariance && !reason.trim()) {
      toast({
        title: "Explanation Required",
        description: "Please explain the variance before proceeding",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { apiClient } = await import('@/api/client');
      const { validateAndSanitize, reconciliationSchema } = await import('@/utils/inputValidation');
      
      // Validate and sanitize input
      const validatedData = validateAndSanitize({
        stationId: selectedStation,
        date: selectedDate,
        reportedCashAmount: Number(actualCash),
        varianceReason: reason || undefined
      }, reconciliationSchema);
      
      await apiClient.post('/reconciliation/close-with-cash', validatedData);

      toast({
        title: "Day Reconciled",
        description: "Business day has been successfully closed",
      });
      setStep(1);
      setSelectedStation('');
      setActualCash('');
      setReason('');
      setSystemSales(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reconcile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FuelLoader text="Loading reconciliation data..." size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Daily Reconciliation</h1>
        <p className="text-muted-foreground">Compare system sales with actual cash collected</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Station & Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              {isPastDate && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Backdated reconciliation will update historical reports
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="station">Station</Label>
              <select
                id="station"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a station</option>
                {stations.map((station: any) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={loadSystemSales}
              disabled={!selectedStation || !selectedDate}
              className="w-full"
            >
              Load Sales Data
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Enter Actual Cash
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {stations.find(s => s.id === selectedStation)?.name} - {formatDate(selectedDate)}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700 mb-1">System Calculated Sales</div>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(systemSales)}
              </div>
            </div>

            <div>
              <Label htmlFor="cash">Actual Cash Collected</Label>
              <Input
                id="cash"
                type="number"
                step="0.01"
                min="0"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                className="text-right font-mono text-lg"
                placeholder="0.00"
              />
            </div>

            {actualCash && (
              <div className={cn(
                "p-4 rounded-lg border",
                variance === 0 ? "bg-green-50 border-green-200" :
                variance > 0 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Variance</span>
                  <span className={cn(
                    "text-lg font-bold",
                    variance === 0 ? "text-green-600" :
                    variance > 0 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                  </span>
                </div>
                
                {variance === 0 && (
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Perfect match!
                  </div>
                )}
                
                {hasVariance && (
                  <div>
                    <div className="flex items-center text-orange-700 mb-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Explanation required
                    </div>
                    <Textarea
                      placeholder="Explain the variance (e.g., credit sales, cash shortage, etc.)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!actualCash || (hasVariance && !reason.trim())}
                className="flex-1"
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Reconciliation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">System Sales</div>
                <div className="text-lg font-bold">{formatCurrency(systemSales)}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">Actual Cash</div>
                <div className="text-lg font-bold">{formatCurrency(Number(actualCash))}</div>
              </div>
            </div>

            {hasVariance && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Variance: {formatCurrency(variance)}</strong><br />
                  Reason: {reason}
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertDescription>
                This will permanently close the business day for {formatDate(selectedDate)}. 
                No more entries will be allowed for this date.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleReconcile}
                disabled={isLoading}
                className="flex-1"
              >
                Confirm & Close Day
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}