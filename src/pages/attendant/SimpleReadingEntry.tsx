/**
 * @file SimpleReadingEntry.tsx
 * @description SUPER SIMPLE reading entry for attendants
 * 
 * ATTENDANT WORKFLOW:
 * 1. Select nozzle (big buttons with pictures)
 * 2. Enter nozzle reading (big number pad)
 * 3. Submit (big green button)
 * 4. Done!
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Fuel, 
  CheckCircle,
  Calculator,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';

interface Nozzle {
  id: string;
  name: string;
  fuelType: string;
  currentPrice: number;
  pumpName: string;
}

interface Reading {
  id: string;
  nozzleId: string;
  nozzleName: string;
  pumpName: string;
  stationName: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  recordedAt: string;
}

export default function SimpleReadingEntry() {
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [selectedNozzle, setSelectedNozzle] = useState<Nozzle | null>(null);
  const [reading, setReading] = useState('');
  const [recentReadings, setRecentReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch available nozzles and recent readings
  const fetchData = async () => {
    try {
      setLoading(true);
      const [nozzlesRes, readingsRes] = await Promise.all([
        apiClient.get('/attendant/nozzles'),
        apiClient.get('/attendant/readings')
      ]);
      
      const nozzlesData = nozzlesRes.data?.data?.nozzles || nozzlesRes.data?.nozzles || nozzlesRes.data?.data || [];
      setNozzles(Array.isArray(nozzlesData) ? nozzlesData : []);
      
      const readingsData = readingsRes.data?.data?.readings || readingsRes.data?.readings || [];
      console.log('Readings API response:', readingsRes.data);
      console.log('Parsed readings data:', readingsData);
      setRecentReadings(Array.isArray(readingsData) ? readingsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNozzles([]);
      setRecentReadings([]);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit reading
  const handleSubmit = async () => {
    if (!selectedNozzle || !reading) {
      toast({
        title: "Missing Information",
        description: "Please select a nozzle and enter reading",
        variant: "destructive"
      });
      return;
    }

    const readingNum = parseFloat(reading);
    if (isNaN(readingNum) || readingNum < 0) {
      toast({
        title: "Invalid Reading",
        description: "Please enter a valid reading value",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      await apiClient.post('/attendant/readings', {
        nozzleId: selectedNozzle.id,
        reading: readingNum,
        recordedAt: new Date().toISOString()
      });

      toast({
        title: "Success!",
        description: `Reading recorded: ${readingNum}L`,
        variant: "default"
      });

      // Refresh data to show new reading
      await fetchData();
      
      // Reset form
      setSelectedNozzle(null);
      setReading('');
      
      // Go back to dashboard
      navigate('/attendant');
      
    } catch (error: any) {
      console.error('Error submitting reading:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add reading",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Number pad for reading entry
  const NumberPad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', '.'];
    
    const handleNumberClick = (num: string) => {
      if (reading.length < 8) { // Limit to reasonable reading
        setReading(prev => prev + num);
      }
    };

    const handleClear = () => {
      setReading('');
    };

    const handleBackspace = () => {
      setReading(prev => prev.slice(0, -1));
    };

    return (
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {numbers.map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          size="lg"
          className="h-16 text-lg"
          onClick={handleBackspace}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-16 text-lg"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading nozzles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/attendant')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Reading</h1>
          <p className="text-gray-600">Select nozzle and enter meter reading</p>
        </div>
      </div>

      {/* Recent Readings */}
      {recentReadings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recentReadings.slice(0, 5).map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{reading.nozzleName}</span>
                      <span className="text-sm text-gray-500">• {reading.fuelType.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(reading.amount)} • {reading.volume.toFixed(2)}L
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(reading.recordedAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Select Nozzle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Step 1: Select Nozzle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.isArray(nozzles) && nozzles.length > 0 ? nozzles.map((nozzle) => (
              <Button
                key={nozzle.id}
                variant={selectedNozzle?.id === nozzle.id ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center p-4"
                onClick={() => setSelectedNozzle(nozzle)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Fuel className="h-5 w-5" />
                  <span className="font-semibold">{nozzle.name}</span>
                </div>
                <div className="text-sm text-center">
                  <div>{nozzle.fuelType.toUpperCase()}</div>
                  <div className="font-medium">{formatCurrency(nozzle.currentPrice)}/L</div>
                </div>
              </Button>
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <Fuel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No nozzles available</p>
                <Button variant="outline" onClick={fetchData} className="mt-2">
                  Retry
                </Button>
              </div>
            )}
          </div>
          
          {selectedNozzle && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Selected: {selectedNozzle.name}</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {selectedNozzle.fuelType.toUpperCase()} • {formatCurrency(selectedNozzle.currentPrice)} per liter
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Enter Reading */}
      {selectedNozzle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Step 2: Enter Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reading Display */}
            <div className="text-center">
              <Label className="text-lg font-medium">Nozzle Reading (L)</Label>
              <div className="text-4xl font-bold text-blue-600 mt-2 mb-4">
                {reading ? `${parseFloat(reading).toLocaleString()}L` : '0L'}
              </div>
              {reading && selectedNozzle && (
                <p className="text-gray-600">
                  Enter the current meter reading from the nozzle
                </p>
              )}
            </div>

            {/* Number Pad */}
            <NumberPad />

            {/* Manual Input (Alternative) */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Or type manually:</p>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter nozzle reading"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="text-center text-xl font-semibold max-w-xs mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {selectedNozzle && reading && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-800">Ready to Submit</h3>
              <p className="text-green-700">
                {selectedNozzle.name} • Reading: {parseFloat(reading).toLocaleString()}L
              </p>
            </div>
            
            <Button
              size="lg"
              className="w-full max-w-xs bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Reading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Add Reading
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">💡 Tips:</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Select the nozzle you used to dispense fuel</li>
                <li>• Enter the current meter reading from the nozzle</li>
                <li>• System will calculate volume and amount</li>
                <li>• Check recent readings above for reference</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}