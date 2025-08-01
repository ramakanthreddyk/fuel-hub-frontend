/**
 * @file components/error/ErrorReportingDashboard.tsx
 * @description Dashboard for viewing and managing error reports
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Download, 
  Trash2, 
  RefreshCw, 
  TrendingUp,
  Clock,
  Bug,
  Activity
} from 'lucide-react';
import { useErrorReporting } from '@/utils/errorReporting';
import type { ErrorReport, ErrorMetrics } from '@/utils/errorReporting';

export const ErrorReportingDashboard: React.FC = () => {
  const { getMetrics, clearReports, exportReports } = useErrorReporting();
  const [metrics, setMetrics] = useState<ErrorMetrics | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorReport | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  const handleExport = () => {
    const data = exportReports();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-reports-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all error reports?')) {
      clearReports();
      setMetrics(getMetrics());
      setSelectedError(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading error metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Error Reporting Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and analyze application errors
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => setMetrics(getMetrics())} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.errorsBySeverity.critical || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.recentErrors.length}
            </div>
            <p className="text-xs text-muted-foreground">Last 10 errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalErrors > 0 ? '↑' : '→'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalErrors > 0 ? 'Active' : 'Stable'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Errors</TabsTrigger>
          <TabsTrigger value="by-type">By Type</TabsTrigger>
          <TabsTrigger value="by-severity">By Severity</TabsTrigger>
          <TabsTrigger value="by-component">By Component</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.recentErrors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent errors found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {metrics.recentErrors.map((error) => (
                    <div
                      key={error.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedError(error)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getSeverityVariant(error.severity)}>
                            {error.severity}
                          </Badge>
                          {error.component && (
                            <Badge variant="outline">{error.component}</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {error.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {error.url.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.errorsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-severity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.errorsBySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                      <span className="text-sm capitalize">{severity}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-component" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.errorsByComponent).map(([component, count]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm">{component}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Error Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedError(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Error ID</label>
                  <p className="text-sm text-muted-foreground">{selectedError.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedError.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Badge variant={getSeverityVariant(selectedError.severity)}>
                    {selectedError.severity}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Component</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedError.component || 'Unknown'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedError.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">URL</label>
                <p className="text-sm text-muted-foreground mt-1 break-all">
                  {selectedError.url}
                </p>
              </div>

              {selectedError.stack && (
                <div>
                  <label className="text-sm font-medium">Stack Trace</label>
                  <pre className="text-xs bg-muted p-3 rounded-md mt-1 overflow-auto">
                    {selectedError.stack}
                  </pre>
                </div>
              )}

              {selectedError.context && (
                <div>
                  <label className="text-sm font-medium">Context</label>
                  <pre className="text-xs bg-muted p-3 rounded-md mt-1 overflow-auto">
                    {JSON.stringify(selectedError.context, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
