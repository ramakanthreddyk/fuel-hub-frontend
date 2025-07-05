import { ReportExporter } from '@/components/reports/ReportExporter';

export default function ReportExportPage() {
  return (
    <div className="max-w-xl mx-auto">
      <ReportExporter stationId="" reportType="sales" filters={{}} />
    </div>
  );
}
