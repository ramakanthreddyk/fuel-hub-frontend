
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, FileText, DollarSign, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

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
      <StatsCard
        title="Today's Readings"
        value={todayReadings}
        description="Total readings recorded"
        icon={<FileText className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Petrol Dispensed"
        value={`${petrolDispensed.toFixed(3)}L`}
        description="Total petrol today"
        icon={<Fuel className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Diesel Dispensed"
        value={`${dieselDispensed.toFixed(3)}L`}
        description="Total diesel today"
        icon={<Fuel className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Active Alerts"
        value={alertsCount}
        description="Requires attention"
        icon={<AlertTriangle className="h-4 w-4" />}
      />
    </div>
  );
}
