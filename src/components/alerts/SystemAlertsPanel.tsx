
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAttendantAlerts, useAcknowledgeAlert } from '@/hooks/useAttendant';
import { useMissingFuelPrices } from '@/hooks/useFuelPriceValidation';
import { AlertTriangle, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SystemAlertsPanel() {
  const { data: alerts = [], isLoading } = useAttendantAlerts();
  const { data: missingPrices = [] } = useMissingFuelPrices();
  const acknowledgeAlert = useAcknowledgeAlert();

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert.mutate(alertId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const hasCriticalAlerts = unacknowledgedAlerts.some(alert => alert.priority === 'critical');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={hasCriticalAlerts ? 'border-red-200 bg-red-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          System Alerts
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive">{unacknowledgedAlerts.length} new</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Important notifications and warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Missing Fuel Prices Alert */}
          {missingPrices.length > 0 && (
            <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-800">Missing Fuel Prices</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    {missingPrices.length} station(s) have missing or outdated fuel prices. 
                    Sales calculations may fail.
                  </p>
                </div>
                <Badge className={getPriorityColor('high')}>High</Badge>
              </div>
            </div>
          )}

          {/* System Alerts */}
          {unacknowledgedAlerts.length === 0 && missingPrices.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>No active alerts</p>
            </div>
          ) : (
            unacknowledgedAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border bg-white">
                <div className="flex items-start gap-3">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={acknowledgeAlert.isPending}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))
          )}

          {unacknowledgedAlerts.length > 5 && (
            <p className="text-sm text-muted-foreground text-center">
              +{unacknowledgedAlerts.length - 5} more alerts
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
