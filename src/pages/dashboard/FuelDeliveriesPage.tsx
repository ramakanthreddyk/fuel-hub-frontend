
import { useFuelDeliveries } from '@/hooks/useFuelDeliveries';
import { DeliveryTable } from '@/components/fuel-deliveries/DeliveryTable';
import { DeliveryForm } from '@/components/fuel-deliveries/DeliveryForm';

export default function FuelDeliveriesPage() {
  const { data: deliveries = [], isLoading } = useFuelDeliveries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fuel Deliveries</h1>
        <p className="text-muted-foreground">Record and track fuel deliveries to your stations</p>
      </div>

      <DeliveryForm />
      <DeliveryTable deliveries={deliveries} isLoading={isLoading} />
    </div>
  );
}
