
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { diagnosticApi } from '@/api/diagnostic';

interface DiagnosticResult {
  status: 'unknown' | 'ok' | 'error';
  error: string | null;
}

interface DiagnosticResults {
  auth: DiagnosticResult;
  tenants: DiagnosticResult;
  users: DiagnosticResult;
  plans: DiagnosticResult;
  dashboard: DiagnosticResult;
  schemaIssues: string[];
}

export function BackendDiagnosticTool() {
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const diagnosticResults = await diagnosticApi.checkBackendHealth();
      setResults(diagnosticResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    if (status === 'ok') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-500" />;
    return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />;
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Backend Diagnostic Tool
        </CardTitle>
        <CardDescription>
          Check backend API health and schema compatibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700 font-medium">Error running diagnostics: {error}</p>
          </div>
        )}

        {results?.schemaIssues?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-amber-700 font-medium">Schema Issues Detected:</p>
            <ul className="list-disc pl-5 mt-2">
              {results.schemaIssues.map((issue, index) => (
                <li key={index} className="text-amber-700">{issue}</li>
              ))}
            </ul>
            <p className="text-amber-700 mt-2 text-sm">
              The backend database schema appears to be missing columns that the API code is trying to access.
              This indicates a mismatch between the database schema and the API code.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {results && Object.entries(results).filter(([key]) => key !== 'schemaIssues').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{key} API</p>
                  {(value as DiagnosticResult).error && (
                    <p className="text-xs text-red-500 mt-1">{(value as DiagnosticResult).error}</p>
                  )}
                </div>
                {getStatusIcon((value as DiagnosticResult).status)}
              </div>
            ))}
          </div>

          <Button 
            onClick={runDiagnostics} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Diagnostics Again
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Recommendations for Backend Team:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Check if database migrations have been applied correctly</li>
              <li>Verify that the database schema matches what the API code expects</li>
              <li>Look for missing columns like 'schema_name' in the database tables</li>
              <li>Consider running database repair scripts if available</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
