
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { InventoryTable } from '@/components/fuel-deliveries/InventoryTable';

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useFuelInventory();

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fuel Inventory</h1>
          <p className="text-slate-600">Monitor current fuel stock levels across all stations</p>
        </div>

        <InventoryTable inventory={inventory} isLoading={isLoading} />
      </div>
    </div>
  );
}
