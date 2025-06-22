
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryForm } from '@/components/fuel-deliveries/DeliveryForm';
import { DeliveryTable } from '@/components/fuel-deliveries/DeliveryTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStations } from '@/hooks/useStations';
import { Truck } from 'lucide-react';

export default function FuelDeliveriesPage() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const { data: stations } = useStations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Deliveries</h1>
          <p className="text-muted-foreground">
            Log and track fuel deliveries to your stations
          </p>
        </div>
      </div>

      {/* Log New Delivery Form */}
      <DeliveryForm />

      {/* Filter by Station */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery History
          </CardTitle>
          <CardDescription>
            View all fuel deliveries. Filter by station to see specific records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedStationId} onValueChange={setSelectedStationId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All stations</SelectItem>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DeliveryTable stationId={selectedStationId || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
