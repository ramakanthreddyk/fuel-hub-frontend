
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FuelDelivery } from '@/api/fuel-deliveries';
import { format } from 'date-fns';

interface DeliveryTableProps {
  deliveries: FuelDelivery[];
  isLoading: boolean;
}

export function DeliveryTable({ deliveries, isLoading }: DeliveryTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Deliveries</CardTitle>
      </CardHeader>
      <CardContent>
        {deliveries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No fuel deliveries recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Volume (L)</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Delivered By</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.stationName}</TableCell>
                  <TableCell>
                    <Badge variant={delivery.fuelType === 'petrol' ? 'default' : 'secondary'}>
                      {delivery.fuelType.charAt(0).toUpperCase() + delivery.fuelType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{delivery.volume.toLocaleString()}</TableCell>
                  <TableCell>{format(new Date(delivery.deliveryDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{delivery.deliveredBy || '-'}</TableCell>
                  <TableCell>{format(new Date(delivery.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
