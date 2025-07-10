import { AttendantCashReport } from "@/components/attendant/AttendantCashReport";

export default function AttendantCashReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Cash Reports</h1>
      <AttendantCashReport />
    </div>
  );
}