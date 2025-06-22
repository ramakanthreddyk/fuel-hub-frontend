
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFuelDeliveries } from '@/hooks/useFuelDeliveries';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface DeliveryTableProps {
  stationId?: string;
}

export function DeliveryTable({ stationId }: DeliveryTableProps) {
  const { data: deliveries, isLoading, error } = useFuelDeliveries(stationId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load deliveries</p>
      </div>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No fuel deliveries recorded</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Volume (L)</TableHead>
            <TableHead>Delivered By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>
                {format(new Date(delivery.deliveryDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{delivery.station?.name || 'Unknown Station'}</TableCell>
              <TableCell>
                <Badge variant={delivery.fuelType === 'petrol' ? 'default' : 'secondary'}>
                  {delivery.fuelType === 'petrol' ? 'Petrol' : 'Diesel'}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">
                {delivery.volume.toLocaleString()}
              </TableCell>
              <TableCell>
                {delivery.deliveredBy || 'Not specified'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
