
import { AttendantAlerts } from '@/components/attendant/AttendantAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function AttendantAlertsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">System Alerts</h1>
      </div>
      
      <AttendantAlerts />
    </div>
  );
}
