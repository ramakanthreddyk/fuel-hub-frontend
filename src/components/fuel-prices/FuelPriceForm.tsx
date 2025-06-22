
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFuelPrice } from '@/hooks/useFuelPrices';
import { useStations } from '@/hooks/useStations';

export function FuelPriceForm() {
  const [stationId, setStationId] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'premium'>('petrol');
  const [price, setPrice] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 16));
  
  const createFuelPrice = useCreateFuelPrice();
  const { data: stations } = useStations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stationId || !price || Number(price) <= 0) return;

    createFuelPrice.mutate({
      stationId,
      fuelType,
      price: Number(price),
      validFrom,
    });

    // Reset form on success
    setPrice('');
    setValidFrom(new Date().toISOString().slice(0, 16));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add/Update Fuel Price</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stationId">Station *</Label>
            <Select value={stationId} onValueChange={setStationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select value={fuelType} onValueChange={(value: 'petrol' | 'diesel' | 'premium') => setFuelType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price per Litre (₹) *</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price per litre"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="validFrom">Valid From *</Label>
            <Input
              id="validFrom"
              type="datetime-local"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={createFuelPrice.isPending || !stationId || !price || Number(price) <= 0}
            className="w-full"
          >
            {createFuelPrice.isPending ? 'Updating...' : 'Update Price'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
