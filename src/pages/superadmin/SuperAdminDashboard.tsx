/**
 * @file pages/superadmin/SuperAdminDashboard.tsx
 * @description SuperAdmin dashboard for managing tenants, plans, and monitoring usage
 */
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Settings,
  Eye,
  UserCheck,
  Activity,
  DollarSign,
  Zap
} from 'lucide-react';

interface SystemStats {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  activeUsersWeek: number;
  totalStations: number;
  totalPumps: number;
  totalNozzles: number;
  reportsToday: number;
  reportsMonth: number;
}

interface PlanDistribution {
  planName: string;
  tenantCount: number;
  monthlyRevenue: number;
}

interface TenantInfo {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  plan: {
    id: string;
    name: string;
    maxStations: number;
    priceMonthly: number;
  };
  usage: {
    currentStations: number;
    totalUsers: number;
    userBreakdown: {
      owners: number;
      managers: number;
      attendants: number;
    };
    reports: {
      today: number;
      thisMonth: number;
    };
  };
  lastActivity: string;
  planLimits: any;
}

const SuperAdminDashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [planDistribution, setPlanDistribution] = useState<PlanDistribution[]>([]);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load system analytics
      const analyticsResponse = await fetch('/api/superadmin/analytics/usage');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.status === 'success') {
        setSystemStats(analyticsData.data.systemStats);
        setPlanDistribution(analyticsData.data.planDistribution);
      }
      
      // Load tenants
      const tenantsResponse = await fetch('/api/superadmin/tenants');
      const tenantsData = await tenantsResponse.json();
      
      if (tenantsData.status === 'success') {
        setTenants(tenantsData.data.tenants);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignPlan = async (tenantId: string, planId: string, reason: string) => {
    try {
      const response = await fetch(`/api/superadmin/tenants/${tenantId}/assign-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, planId, reason })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Plan assigned successfully: ${data.data.message}`);
        loadDashboardData(); // Reload data
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error assigning plan');
    }
  };

  const toggleTenantStatus = async (tenantId: string, newStatus: string, reason: string) => {
    try {
      const response = await fetch(`/api/superadmin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Tenant status changed: ${data.data.message}`);
        loadDashboardData(); // Reload data
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error changing tenant status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            SuperAdmin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage tenants, plans, and monitor system usage</p>
        </div>

        {/* System Stats */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalTenants}</p>
                  <p className="text-sm text-green-600">{systemStats.activeTenants} active</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                  <p className="text-sm text-green-600">{systemStats.activeUsersWeek} active this week</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Infrastructure</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalStations}</p>
                  <p className="text-sm text-gray-600">{systemStats.totalPumps} pumps, {systemStats.totalNozzles} nozzles</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.reportsToday}</p>
                  <p className="text-sm text-gray-600">{systemStats.reportsMonth} this month</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Plan Distribution
            </h2>
            <div className="space-y-4">
              {planDistribution.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{plan.planName}</p>
                    <p className="text-sm text-gray-600">{plan.tenantCount} tenants</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${plan.monthlyRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">monthly</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions xx
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/superadmin/analytics'}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-600">Detailed usage analytics</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/superadmin/security'}
                className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Security Alerts</p>
                    <p className="text-sm text-gray-600">Monitor suspicious activities</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/superadmin/plans'}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Plans</p>
                    <p className="text-sm text-gray-600">Configure subscription plans</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tenant Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.usage.totalUsers} users</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.plan.name}</div>
                        <div className="text-sm text-gray-500">${tenant.plan.priceMonthly}/month</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {tenant.usage.currentStations}/{tenant.plan.maxStations} stations
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.usage.reports.today} reports today
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tenant.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => setSelectedTenant(tenant.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const newStatus = tenant.status === 'active' ? 'suspended' : 'active';
                          const reason = prompt(`Reason for ${newStatus === 'active' ? 'activating' : 'suspending'} ${tenant.name}:`);
                          if (reason) toggleTenantStatus(tenant.id, newStatus, reason);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
