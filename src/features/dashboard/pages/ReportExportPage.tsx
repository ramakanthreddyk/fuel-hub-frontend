
import { ReportExporter } from '@/components/reports/ReportExporter';

export default function ReportExportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto py-8">
        <ReportExporter stationId="" reportType="sales" filters={{}} />
      </div>
    </div>
  );
}
