
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FuelInventory } from '@/api/api-contract';
import { format } from 'date-fns';

interface InventoryTableProps {
  inventory: FuelInventory[];
  isLoading: boolean;
}

export function InventoryTable({ inventory, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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
        <CardTitle>Fuel Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        {inventory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No inventory data available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Current Volume (L)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.stationName}</TableCell>
                  <TableCell>
                    <Badge variant={item.fuelType === 'petrol' ? 'default' : 'secondary'}>
                      {item.fuelType.charAt(0).toUpperCase() + item.fuelType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${item.currentVolume < 1000 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.currentVolume.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(item.lastUpdated), 'MMM dd, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
