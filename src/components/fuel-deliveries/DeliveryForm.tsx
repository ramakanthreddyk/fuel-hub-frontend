
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
    quantity: 0,
    deliveryDate: new Date().toISOString().split('T')[0],
    supplier: '',
    supplierName: '',
    invoiceNumber: '',
    pricePerLitre: 0,
    deliveredBy: ''
  });

  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const createDelivery = useCreateFuelDelivery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stationId || !formData.quantity || !formData.supplierName || !formData.invoiceNumber) return;
    
    // Ensure volume is set from quantity
    const submitData = {
      ...formData,
      volume: formData.quantity,
      supplier: formData.supplierName
    };

    createDelivery.mutate(submitData, {
      onSuccess: () => {
        setFormData({
          stationId: '',
          fuelType: 'petrol',
          volume: 0,
          quantity: 0,
          deliveryDate: new Date().toISOString().split('T')[0],
          supplier: '',
          supplierName: '',
          invoiceNumber: '',
          pricePerLitre: 0,
          deliveredBy: ''
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
              <Label htmlFor="quantity">Quantity (Litres) *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({ ...formData, quantity: value, volume: value });
                }}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerLitre">Price per Liter *</Label>
              <Input
                id="pricePerLitre"
                type="number"
                value={formData.pricePerLitre || ''}
                onChange={(e) => setFormData({ ...formData, pricePerLitre: Number(e.target.value) })}
                placeholder="Enter price per liter"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name *</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value, supplier: e.target.value })}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="Enter invoice number"
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

            <div className="space-y-2">
              <Label htmlFor="deliveredBy">Delivered By</Label>
              <Input
                id="deliveredBy"
                value={formData.deliveredBy || ''}
                onChange={(e) => setFormData({ ...formData, deliveredBy: e.target.value })}
                placeholder="Truck number or delivery person"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={createDelivery.isPending || !formData.stationId || !formData.quantity || !formData.supplierName || !formData.invoiceNumber}
            className="w-full md:w-auto"
          >
            {createDelivery.isPending ? 'Recording...' : 'Record Delivery'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
