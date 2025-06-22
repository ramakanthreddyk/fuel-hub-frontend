
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

const LOW_STOCK_THRESHOLD = 500; // litres

export function InventoryTable() {
  const { data: inventory, isLoading, error } = useFuelInventory();

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
        <p className="text-muted-foreground">Failed to load inventory data</p>
      </div>
    );
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Station</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Available Volume</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const isLowStock = item.availableVolume < LOW_STOCK_THRESHOLD;
            
            return (
              <TableRow key={item.id} className={isLowStock ? 'bg-red-50' : ''}>
                <TableCell>{item.station?.name || 'Unknown Station'}</TableCell>
                <TableCell>
                  <Badge variant={item.fuelType === 'petrol' ? 'default' : 'secondary'}>
                    {item.fuelType === 'petrol' ? 'Petrol' : 'Diesel'}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {item.availableVolume.toLocaleString()} L
                </TableCell>
                <TableCell>
                  {isLowStock ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Low Stock</span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-green-600">
                      In Stock
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(item.lastUpdated), 'MMM dd, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
