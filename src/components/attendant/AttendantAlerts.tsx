
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useAttendantAlerts, useAcknowledgeAlert } from '@/hooks/api/useAttendant';
import { AttendantAlert } from '@/api/services/attendantService';

interface AttendantAlertsProps {
  stationId?: string;
}

export function AttendantAlerts({ stationId }: AttendantAlertsProps) {
  const { data: alerts = [], isLoading } = useAttendantAlerts(stationId, true);
  const acknowledgeAlert = useAcknowledgeAlert();

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert.mutateAsync(alertId);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const getAlertIcon = (severity: AttendantAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (severity: AttendantAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>All clear - no active alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts at this time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>
          {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map(alert => (
          <Alert 
            key={alert.id} 
            variant={getAlertVariant(alert.severity)}
            className="relative"
          >
            {getAlertIcon(alert.severity)}
            <AlertTitle className="pr-8">{alert.title}</AlertTitle>
            <AlertDescription className="mt-2">
              {alert.message}
              {alert.stationName && (
                <div className="text-xs mt-1 opacity-75">
                  Station: {alert.stationName}
                </div>
              )}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => handleAcknowledge(alert.id)}
              disabled={acknowledgeAlert.isPending}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
