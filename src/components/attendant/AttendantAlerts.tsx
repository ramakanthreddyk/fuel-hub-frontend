
import { useAttendantAlerts, useAcknowledgeAlert } from "@/hooks/api/useAttendant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AttendantAlertsProps {
  stationId?: string;
}

export function AttendantAlerts({ stationId }: AttendantAlertsProps) {
  const { data: alerts = [], isLoading } = useAttendantAlerts(stationId, true);
  const acknowledgeAlert = useAcknowledgeAlert();

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert.mutate(alertId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-muted-foreground">No active alerts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert 
            key={alert.id} 
            variant={
              alert.severity === 'critical' ? 'destructive' : 
              alert.severity === 'warning' ? 'warning' : 'default'
            }
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div className="flex-1">
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleAcknowledge(alert.id)}
              disabled={acknowledgeAlert.isPending}
            >
              Acknowledge
            </Button>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
