import { apiClient } from './client';

/**
 * Diagnostic tool to check backend API health and schema compatibility
 */
export const diagnosticApi = {
  /**
   * Check the backend API health and schema compatibility
   * This function makes various API calls to check if the backend is working correctly
   * and if the schema is compatible with the frontend
   */
  checkBackendHealth: async () => {
    const results = {
      auth: { status: 'unknown', error: null },
      tenants: { status: 'unknown', error: null },
      users: { status: 'unknown', error: null },
      plans: { status: 'unknown', error: null },
      dashboard: { status: 'unknown', error: null },
      schemaIssues: []
    };

    // Check auth endpoint
    try {
      console.log('Checking auth endpoint...');
      // Just check if the endpoint exists, don't actually try to login
      await apiClient.options('/auth/login');
      results.auth.status = 'ok';
    } catch (error) {
      results.auth.status = 'error';
      results.auth.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Auth endpoint has schema_name issues');
        }
      }
    }

    // Check organizations endpoint
    try {
      console.log('Checking organizations endpoint...');
      await apiClient.options('/admin/organizations');
      results.tenants.status = 'ok';
    } catch (error) {
      results.tenants.status = 'error';
      results.tenants.error = error.message;
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('schema_name')) {
          results.schemaIssues.push('Organizations endpoint has schema_name issues');
        }
      }
    }

    // Check users endpoint
    try {
      console.log('Checking users endpoint...');
      await apiClient.options('/admin/users');
      results.users.status = 'ok';
    } catch (error) {
      results.users.status = 'error';
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
      results.plans.status = 'ok';
    } catch (error) {
      results.plans.status = 'error';
      results.plans.error = error.message;
    }

    // Check dashboard endpoint
    try {
      console.log('Checking dashboard endpoint...');
      await apiClient.options('/admin/dashboard');
      results.dashboard.status = 'ok';
    } catch (error) {
      results.dashboard.status = 'error';
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