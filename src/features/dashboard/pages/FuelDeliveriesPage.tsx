
import { useFuelDeliveries } from '@/hooks/useFuelDeliveries';
import { DeliveryTable } from '@/components/fuel-deliveries/DeliveryTable';
import { DeliveryForm } from '@/components/fuel-deliveries/DeliveryForm';
import { ErrorFallback } from '@/components/common/ErrorFallback';

export default function FuelDeliveriesPage() {
  const { data: deliveriesData, isLoading, error, refetch } = useFuelDeliveries();

  // Ensure we always have an array to work with
  const deliveries = Array.isArray(deliveriesData) ? deliveriesData : [];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Deliveries</h1>
          <p className="text-muted-foreground">Record and track fuel deliveries to your stations</p>
        </div>
        <ErrorFallback 
          error={error} 
          onRetry={() => refetch()} 
          title="Failed to load fuel deliveries"
        />
      </div>
    );
  }

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
