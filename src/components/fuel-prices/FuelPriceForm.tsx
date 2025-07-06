
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStations } from '@/hooks/api/useStations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesService } from '@/api/services/fuelPricesService';
import { AlertCircle, Building2, Fuel, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FuelPriceForm() {
  const [searchParams] = useSearchParams();
  const [stationId, setStationId] = useState(searchParams.get('stationId') || '');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'premium'>(
    (searchParams.get('fuelType') as 'petrol' | 'diesel' | 'premium') || 'petrol'
  );
  const [price, setPrice] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 16));
  
  const queryClient = useQueryClient();
  
  const createFuelPrice = useMutation({
    mutationFn: (data: any) => fuelPricesService.createFuelPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
    },
  });
  const { data: stations = [], isLoading: stationsLoading, error: stationsError } = useStations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stationId || !price || Number(price) <= 0) {
      return;
    }

    try {
      await createFuelPrice.mutateAsync({
        stationId,
        fuelType,
        price: Number(price),
        validFrom,
      });

      // Reset form on success
      setPrice('');
      setValidFrom(new Date().toISOString().slice(0, 16));
    } catch (error) {
      console.error('Failed to create fuel price:', error);
    }
  };

  if (stationsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Error Loading Stations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load stations. Please refresh the page or contact support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Add/Update Fuel Price
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stationId" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Station *
              </Label>
              <Select value={stationId} onValueChange={setStationId} disabled={stationsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={stationsLoading ? "Loading stations..." : "Select station"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(stations) && stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {station.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {stationsLoading && (
                <p className="text-xs text-muted-foreground">Loading available stations...</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType" className="flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Fuel Type *
              </Label>
              <Select value={fuelType} onValueChange={(value: 'petrol' | 'diesel' | 'premium') => setFuelType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Petrol
                    </div>
                  </SelectItem>
                  <SelectItem value="diesel">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Diesel
                    </div>
                  </SelectItem>
                  <SelectItem value="premium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Premium
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Price per Litre (₹) *
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price per litre"
                min="0"
                step="0.01"
                required
                className="text-lg font-medium"
              />
              {price && Number(price) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Price: ₹{Number(price).toFixed(2)} per litre
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="validFrom" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Valid From *
              </Label>
              <Input
                id="validFrom"
                type="datetime-local"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
              />
            </div>
          </div>

          {!stationId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a station to set fuel prices for.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={
              createFuelPrice.isPending || 
              !stationId || 
              !price || 
              Number(price) <= 0 ||
              stationsLoading
            }
            className="w-full md:w-auto"
            size="lg"
          >
            {createFuelPrice.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Price...
              </>
            ) : (
              <>
                <Fuel className="h-4 w-4 mr-2" />
                Update Price
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
