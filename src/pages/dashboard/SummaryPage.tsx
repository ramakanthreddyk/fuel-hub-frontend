
import { SalesSummaryCard } from '@/components/dashboard/SalesSummaryCard';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { FuelBreakdownChart } from '@/components/dashboard/FuelBreakdownChart';
import { TopCreditorsTable } from '@/components/dashboard/TopCreditorsTable';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';

export default function SummaryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Summary</h1>
        <p className="text-muted-foreground">
          Overview of business performance and key metrics
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <SalesSummaryCard />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <PaymentMethodChart />
        <FuelBreakdownChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesTrendChart />
        <TopCreditorsTable />
      </div>
    </div>
  );
}
