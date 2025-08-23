import React, { useState, useEffect } from 'react';
import { secureLog } from '@/utils/security';
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { diagnosticApi } from '@/api/diagnostic';

export function ApiDiagnosticPanel() {
  const [isChecking, setIsChecking] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [redirectInfo, setRedirectInfo] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsChecking(true);
    try {
      // Get API connectivity status
      const status = await diagnosticApi.checkConnectivity();
      setApiStatus(status);
      
      // Get browser network info
      const netInfo = diagnosticApi.getBrowserNetworkInfo();
      setNetworkInfo(netInfo);
      
      // Check for redirects
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
        'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';
      
      const redirects = await diagnosticApi.checkRedirects(`${<SafeText text={API_BASE_URL} />}/api/v1/dashboard/sales-summary`);
      setRedirectInfo(redirects);
    } catch (error) {
      secureLog.error('Diagnostic check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-slate-900">API Diagnostics</CardTitle>
        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          variant="outline" 
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking...' : 'Run Diagnostics'}
        </Button>
      </CardHeader>
      <CardContent>
        {apiStatus && (
          <Alert className={apiStatus.status === 'connected' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            <div className="flex items-center gap-2">
              {apiStatus.status === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertTitle className={apiStatus.status === 'connected' ? 'text-green-800' : 'text-red-800'}>
                API {apiStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2 text-sm">
              <div className="space-y-1">
                <p><strong>Base URL:</strong> {<SafeText text={apiStatus.baseUrl} />}</p>
                <p><strong>Timestamp:</strong> {<SafeText text={apiStatus.timestamp} />}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {redirectInfo && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Redirect Check</h3>
            <div className="text-sm space-y-1 bg-slate-50 p-3 rounded-md">
              <p><strong>Original URL:</strong> {<SafeText text={redirectInfo.originalUrl} />}</p>
              <p><strong>Final URL:</strong> {<SafeText text={redirectInfo.finalUrl} />}</p>
              <p><strong>Redirected:</strong> {redirectInfo.redirected ? 'Yes' : 'No'}</p>
              <p><strong>Redirect Count:</strong> {<SafeText text={redirectInfo.redirectCount} />}</p>
            </div>
          </div>
        )}

        {networkInfo && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Browser Network Info</h3>
            <div className="text-sm space-y-1 bg-slate-50 p-3 rounded-md">
              <p><strong>Online:</strong> {networkInfo.onLine ? 'Yes' : 'No'}</p>
              <p><strong>User Agent:</strong> {<SafeText text={networkInfo.userAgent} />}</p>
              <p><strong>Cookies Enabled:</strong> {networkInfo.cookiesEnabled ? 'Yes' : 'No'}</p>
              <p><strong>Do Not Track:</strong> {networkInfo.doNotTrack || 'Not set'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}