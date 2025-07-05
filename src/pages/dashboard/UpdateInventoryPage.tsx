import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';
import { useUpdateInventory } from '@/hooks/api/useInventory';
import { useToast } from '@/hooks/use-toast';

export default function UpdateInventoryPage() {
  const [stationId, setStationId] = useState<string | undefined>();
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'premium'>('petrol');
  const [newStock, setNewStock] = useState('');
  const { mutateAsync, isPending } = useUpdateInventory();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!stationId || !newStock) return;
    const success = await mutateAsync({
      stationId,
      fuelType,
      newStock: Number(newStock)
    });
    toast({
      title: success ? 'Inventory Updated' : 'Error',
      description: success ? 'Stock levels updated.' : 'Failed to update inventory',
      variant: success ? 'default' : 'destructive'
    });
    if (success) setNewStock('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Station</Label>
            <SearchableStationSelector value={stationId} onChange={setStationId} />
          </div>
          <div>
            <Label>Fuel Type</Label>
            <Select value={fuelType} onValueChange={(v) => setFuelType(v as any)}>
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
            <Label>New Stock (L)</Label>
            <Input value={newStock} onChange={(e) => setNewStock(e.target.value)} type="number" />
          </div>
          <Button onClick={handleSubmit} disabled={isPending || !stationId || !newStock}>
            {isPending ? 'Updating...' : 'Update'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
