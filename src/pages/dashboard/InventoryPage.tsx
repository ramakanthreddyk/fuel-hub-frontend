
import { useFuelInventory } from '@/hooks/useFuelInventory';
import { InventoryTable } from '@/components/fuel-deliveries/InventoryTable';
import { useState } from 'react';
import { updateInventory } from '@/api/services/inventoryService';
import { useAutoLoader } from '@/hooks/useAutoLoader';

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useFuelInventory();
  
  useAutoLoader(isLoading, 'Loading inventory...');

  // Form state
  const [stationId, setStationId] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [newStock, setNewStock] = useState('');
  const [capacity, setCapacity] = useState('');
  const [minimumLevel, setMinimumLevel] = useState('');
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('');
    if (!stationId || !fuelType || !newStock) {
      setFormStatus('Please fill all required fields.');
      return;
    }
    const payload: any = {
      stationId,
      fuelType,
      newStock: Number(newStock),
    };
    if (capacity) payload.capacity = Number(capacity);
    if (minimumLevel) payload.minimumLevel = Number(minimumLevel);
    try {
      await updateInventory(payload);
      setFormStatus('Inventory updated successfully.');
    } catch (err) {
      setFormStatus('Failed to update inventory.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fuel Inventory</h1>
          <p className="text-slate-600">Monitor current fuel stock levels across all stations</p>
        </div>

        {/* Inventory Update Form */}
        <form className="space-y-4 bg-slate-50 p-4 rounded shadow" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Update Inventory</h2>
          <div>
            <label className="block text-sm font-medium">Station ID *</label>
            <input type="text" className="border p-2 w-full" value={stationId} onChange={e => setStationId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Fuel Type *</label>
            <input type="text" className="border p-2 w-full" value={fuelType} onChange={e => setFuelType(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">New Stock *</label>
            <input type="number" className="border p-2 w-full" value={newStock} onChange={e => setNewStock(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input type="number" className="border p-2 w-full" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Low Stock Threshold</label>
            <input type="number" className="border p-2 w-full" value={minimumLevel} onChange={e => setMinimumLevel(e.target.value)} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Inventory</button>
          {formStatus && <div className="mt-2 text-sm text-red-600">{formStatus}</div>}
        </form>

        <InventoryTable inventory={inventory} isLoading={isLoading} />
      </div>
    </div>
  );
}
