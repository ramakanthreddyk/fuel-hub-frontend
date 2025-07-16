import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';
import { useUpdateInventory, useInventory } from '@/hooks/api/useInventory';
import { useToast } from '@/hooks/use-toast';
import { Fuel, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateInventoryPage() {
  const [stationId, setStationId] = useState<string | undefined>();
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'premium'>('petrol');
  const [newStock, setNewStock] = useState('');
  const [capacity, setCapacity] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const { mutateAsync, isPending } = useUpdateInventory();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get current inventory data for the selected station and fuel type
  const { data: inventoryData = [] } = useInventory(stationId);
  
  // When station or fuel type changes, try to pre-fill values
  useEffect(() => {
    if (stationId && fuelType) {
      const currentItem = inventoryData.find(item => 
        item.stationId === stationId && item.fuelType === fuelType
      );
      
      if (currentItem) {
        // Pre-fill with current values, safely handling undefined/null values
        const stockValue = currentItem.currentStock != null ? String(currentItem.currentStock) : '';
        // Backend uses minimumLevel for both capacity and threshold
        const minimumValue = currentItem.minimumLevel != null ? String(currentItem.minimumLevel) : '';
        const capacityValue = minimumValue; // In the backend, capacity = minimumLevel
        
        setNewStock(stockValue);
        setCapacity(minimumValue);
        setLowThreshold(minimumValue);
      } else {
        // Reset fields if no existing data
        setNewStock('');
        setCapacity('');
        setLowThreshold('');
      }
    }
  }, [stationId, fuelType, inventoryData]);

  const handleSubmit = async () => {
    if (!stationId || !newStock) return;
    
    // Validate inputs
    const stockValue = Number(newStock);
    const capacityValue = capacity ? Number(capacity) : undefined;
    const minimumLevelValue = lowThreshold ? Number(lowThreshold) : undefined;
    
    if (stockValue < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Stock level cannot be negative',
        variant: 'destructive'
      });
      return;
    }
    
    if (capacityValue && stockValue > capacityValue) {
      toast({
        title: 'Invalid Input',
        description: 'Stock level cannot exceed tank capacity',
        variant: 'destructive'
      });
      return;
    }
    
    if (minimumLevelValue && minimumLevelValue > capacityValue) {
      toast({
        title: 'Invalid Input',
        description: 'Low stock threshold cannot exceed tank capacity',
        variant: 'destructive'
      });
      return;
    }
    
    // In the backend, we only use minimumLevel for both capacity and threshold
    // If both are provided, use the threshold value
    const finalMinimumLevel = minimumLevelValue || capacityValue;
    
    const updateData = {
      stationId,
      fuelType,
      newStock: stockValue,
      ...(finalMinimumLevel ? { minimumLevel: finalMinimumLevel } : {})
    };
    
    try {
      const success = await mutateAsync(updateData);
      
      if (success) {
        let message = `${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} inventory updated to ${stockValue} liters`;
        
        if (finalMinimumLevel) {
          message += `, capacity/threshold set to ${finalMinimumLevel} liters`;
        }
        
        toast({
          title: 'Inventory Updated',
          description: message,
          variant: 'default'
        });
        
        // Navigate back to inventory page after successful update
        setTimeout(() => navigate('/dashboard/fuel-inventory'), 1500);
      } else {
        toast({
          title: 'Update Failed',
          description: 'Could not update inventory. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('[UpdateInventory] Error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Update Inventory</h1>
          <p className="text-muted-foreground text-sm">
            Update fuel stock levels and tank information
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/fuel-inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Fuel Stock</CardTitle>
          <CardDescription>
            Enter the current stock level for the selected fuel type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Station *</Label>
            <SearchableStationSelector value={stationId} onChange={setStationId} />
          </div>
          <div>
            <Label>Fuel Type *</Label>
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
            <Label>Current Stock (L) *</Label>
            <Input 
              value={newStock} 
              onChange={(e) => setNewStock(e.target.value)} 
              type="number" 
              placeholder="Enter current stock level"
            />
          </div>
          <div>
            <Label>Tank Capacity / Low Stock Threshold (L)</Label>
            <Input 
              value={capacity} 
              onChange={(e) => {
                setCapacity(e.target.value);
                setLowThreshold(e.target.value); // Keep both values in sync
              }} 
              type="number" 
              placeholder="Enter tank capacity"
            />
            <p className="text-xs text-muted-foreground mt-1">
              System will alert when stock falls below this level
            </p>
          </div>
          <div className="pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isPending || !stationId || !newStock}
              className="w-full"
            >
              <Fuel className="mr-2 h-4 w-4" />
              {isPending ? 'Updating...' : 'Update Inventory'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
