
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { InventoryTable } from '@/components/fuel-deliveries/InventoryTable';

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useFuelInventory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fuel Inventory</h1>
        <p className="text-muted-foreground">Monitor current fuel stock levels across all stations</p>
      </div>

      <InventoryTable inventory={inventory} isLoading={isLoading} />
    </div>
  );
}
