import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Droplet, AlertTriangle, DollarSign } from "lucide-react";

interface AttendantDashboardStatsProps {
  todayReadings: number;
  petrolDispensed: number;
  dieselDispensed: number;
  alertsCount: number;
}

export function AttendantDashboardStats({
  todayReadings,
  petrolDispensed,
  dieselDispensed,
  alertsCount
}: AttendantDashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Readings</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayReadings}</div>
          <p className="text-xs text-muted-foreground">Readings recorded today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Petrol Dispensed</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{petrolDispensed.toFixed(2)} L</div>
          <p className="text-xs text-muted-foreground">Total petrol dispensed today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diesel Dispensed</CardTitle>
          <Droplet className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dieselDispensed.toFixed(2)} L</div>
          <p className="text-xs text-muted-foreground">Total diesel dispensed today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsCount}</div>
          <p className="text-xs text-muted-foreground">Alerts requiring attention</p>
        </CardContent>
      </Card>
    </div>
  );
}