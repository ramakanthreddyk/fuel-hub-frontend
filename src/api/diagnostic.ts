
import { apiClient } from './client';

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

/**
 * Diagnostic tool to check backend API health and schema compatibility
 */
export const diagnosticApi = {
  /**
   * Check the backend API health and schema compatibility
   * This function makes various API calls to check if the backend is working correctly
   * and if the schema is compatible with the frontend
   */
  checkBackendHealth: async (): Promise<DiagnosticResults> => {
    const results: DiagnosticResults = {
      auth: { status: 'unknown' as const, error: null },
      tenants: { status: 'unknown' as const, error: null },
      users: { status: 'unknown' as const, error: null },
      plans: { status: 'unknown' as const, error: null },
      dashboard: { status: 'unknown' as const, error: null },
      schemaIssues: []
    };

    // Check auth endpoint
    try {
      console.log('Checking auth endpoint...');
      // Just check if the endpoint exists, don't actually try to login
      await apiClient.options('/auth/login');
      results.auth.status = 'ok' as const;
    } catch (error: any) {
      results.auth.status = 'error' as const;
      results.auth.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Auth endpoint has schema_name issues');
        }
      }
    }

    // Check tenants endpoint (corrected from organizations)
    try {
      console.log('Checking tenants endpoint...');
      await apiClient.options('/admin/tenants');
      results.tenants.status = 'ok' as const;
    } catch (error: any) {
      results.tenants.status = 'error' as const;
      results.tenants.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Tenants endpoint has schema_name issues');
        }
      }
    }

    // Check users endpoint
    try {
      console.log('Checking users endpoint...');
      await apiClient.options('/admin/users');
      results.users.status = 'ok' as const;
    } catch (error: any) {
      results.users.status = 'error' as const;
      results.users.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Users endpoint has schema_name issues');
        }
      }
    }

    // Check plans endpoint
    try {
      console.log('Checking plans endpoint...');
      await apiClient.options('/admin/plans');
      results.plans.status = 'ok' as const;
    } catch (error: any) {
      results.plans.status = 'error' as const;
      results.plans.error = error.message;
    }

    // Check dashboard endpoint
    try {
      console.log('Checking dashboard endpoint...');
      await apiClient.options('/admin/dashboard');
      results.dashboard.status = 'ok' as const;
    } catch (error: any) {
      results.dashboard.status = 'error' as const;
      results.dashboard.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Dashboard endpoint has schema_name issues');
        }
      }
    }

    return results;
  }
};
