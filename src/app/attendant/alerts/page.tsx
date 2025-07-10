import { AttendantAlerts } from "@/components/attendant/AttendantAlerts";

export default function AttendantAlertsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>
      <AttendantAlerts />
    </div>
  );
}