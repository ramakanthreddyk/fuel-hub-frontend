
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFuelDelivery } from '@/hooks/useFuelDeliveries';
import { useStations } from '@/hooks/useStations';
import { CreateFuelDeliveryRequest } from '@/api/fuel-deliveries';

interface DeliveryFormData {
  stationId: string;
  fuelType: 'petrol' | 'diesel';
  volume: number;
  deliveryDate: string;
  deliveredBy: string;
}

export function DeliveryForm() {
  const [showForm, setShowForm] = useState(false);
  const { data: stations } = useStations();
  const createDelivery = useCreateFuelDelivery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DeliveryFormData>({
    defaultValues: {
      deliveryDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: DeliveryFormData) => {
    const deliveryData: CreateFuelDeliveryRequest = {
      stationId: data.stationId,
      fuelType: data.fuelType,
      volume: Number(data.volume),
      deliveryDate: data.deliveryDate,
      deliveredBy: data.deliveredBy || undefined,
    };

    await createDelivery.mutateAsync(deliveryData);
    reset();
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        Log New Delivery
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Fuel Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stationId">Station</Label>
              <Select onValueChange={(value) => setValue('stationId', value)}>
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
              {errors.stationId && (
                <p className="text-sm text-destructive">Station is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select onValueChange={(value) => setValue('fuelType', value as 'petrol' | 'diesel')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p className="text-sm text-destructive">Fuel type is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume (Litres)</Label>
              <Input
                id="volume"
                type="number"
                min="1"
                step="0.01"
                {...register('volume', {
                  required: 'Volume is required',
                  min: { value: 1, message: 'Volume must be at least 1 litre' }
                })}
              />
              {errors.volume && (
                <p className="text-sm text-destructive">{errors.volume.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                {...register('deliveryDate', { required: 'Delivery date is required' })}
              />
              {errors.deliveryDate && (
                <p className="text-sm text-destructive">{errors.deliveryDate.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deliveredBy">Delivered By (Optional)</Label>
              <Input
                id="deliveredBy"
                placeholder="e.g., IOCL, Bharat Petroleum"
                {...register('deliveredBy')}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createDelivery.isPending}>
              {createDelivery.isPending ? 'Logging...' : 'Log Delivery'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
