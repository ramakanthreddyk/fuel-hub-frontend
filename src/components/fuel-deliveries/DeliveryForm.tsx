
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStations } from '@/hooks/useStations';
import { useCreateFuelDelivery } from '@/hooks/useFuelDeliveries';
import { CreateFuelDeliveryRequest } from '@/api/fuel-delivery-types';

export function DeliveryForm() {
  const [formData, setFormData] = useState<CreateFuelDeliveryRequest>({
    stationId: '',
    fuelType: 'petrol',
    volume: 0,
    deliveryDate: new Date().toISOString().split('T')[0],
    supplier: ''
  });

  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const createDelivery = useCreateFuelDelivery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stationId || !formData.volume || !formData.supplier) return;

    createDelivery.mutate(formData, {
      onSuccess: () => {
        setFormData({
          stationId: '',
          fuelType: 'petrol',
          volume: 0,
          deliveryDate: new Date().toISOString().split('T')[0],
          supplier: ''
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record New Fuel Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="station">Station *</Label>
              <Select 
                value={formData.stationId} 
                onValueChange={(value) => setFormData({ ...formData, stationId: value })}
                disabled={stationsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select 
                value={formData.fuelType} 
                onValueChange={(value: 'petrol' | 'diesel' | 'premium') => setFormData({ ...formData, fuelType: value })}
              >
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

            <div className="space-y-2">
              <Label htmlFor="volume">Volume (Litres) *</Label>
              <Input
                id="volume"
                type="number"
                value={formData.volume || ''}
                onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
                placeholder="Enter volume"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier Name *</Label>
              <Input
                id="supplier"
                value={formData.supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date *</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={createDelivery.isPending || !formData.stationId || !formData.volume || !formData.supplier}
            className="w-full md:w-auto"
          >
            {createDelivery.isPending ? 'Recording...' : 'Record Delivery'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
