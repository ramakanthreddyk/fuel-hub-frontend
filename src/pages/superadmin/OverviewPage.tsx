import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminOverviewPage() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const summary = {
    tenantCount: 12,
    activeTenantCount: 10,
    adminCount: 3,
    planCount: 4,
    totalRevenue: 2450000,
    activeUsers: 156,
    systemHealth: 98.5
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-tenant':
        navigate('/superadmin/tenants');
        break;
      case 'manage-users':
        navigate('/superadmin/users');
        break;
      case 'update-plans':
        navigate('/superadmin/plans');
        break;
      case 'view-analytics':
        navigate('/superadmin/analytics');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-purple-600">👑</span>
            SuperAdmin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your FuelSync platform</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleQuickAction('add-tenant')} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>+</span>
            Add Tenant
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{summary.tenantCount}</p>
              <p className="text-xs text-gray-500">{summary.activeTenantCount} active organizations</p>
            </div>
            <div className="text-purple-600 text-2xl">🏢</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{summary.adminCount}</p>
              <p className="text-xs text-gray-500">SuperAdmin users</p>
            </div>
            <div className="text-blue-600 text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscription Plans</p>
              <p className="text-2xl font-bold text-gray-900">{summary.planCount}</p>
              <p className="text-xs text-gray-500">Available plans</p>
            </div>
            <div className="text-green-600 text-2xl">📦</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">{summary.systemHealth}%</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
            <div className="text-orange-600 text-2xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-purple-600">🚀</span>
            Quick Actions
          </h2>
          <p className="text-gray-600 mb-4">Common administrative tasks</p>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add-tenant')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-purple-600">🏢</span>
              <div>
                <p className="font-medium">Add New Tenant</p>
                <p className="text-sm text-gray-500">Create a new organization</p>
              </div>
            </button>
            <button 
              onClick={() => handleQuickAction('manage-users')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-blue-600">👥</span>
              <div>
                <p className="font-medium">Manage Admin Users</p>
                <p className="text-sm text-gray-500">Add or modify admin users</p>
              </div>
            </button>
            <button 
              onClick={() => handleQuickAction('update-plans')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-green-600">📦</span>
              <div>
                <p className="font-medium">Update Subscription Plans</p>
                <p className="text-sm text-gray-500">Modify pricing and features</p>
              </div>
            </button>
            <button 
              onClick={() => handleQuickAction('view-analytics')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-orange-600">📊</span>
              <div>
                <p className="font-medium">View Platform Analytics</p>
                <p className="text-sm text-gray-500">System insights and metrics</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-green-600">✅</span>
            System Status
          </h2>
          <p className="text-gray-600 mb-4">Platform health and performance</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Services</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Background Jobs</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Running</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-600">75% Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-600">📈</span>
          Recent Platform Activity
        </h2>
        <p className="text-gray-600 mb-4">Latest tenant and system activities</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">New tenant "ABC Fuel Station" registered</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">System backup completed successfully</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Premium plan updated with new features</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✅</span>
          <p className="text-green-800 font-medium">SuperAdmin interface is working perfectly!</p>
        </div>
        <p className="text-green-600 text-sm mt-1">You have full administrative access to the FuelSync platform.</p>
      </div>
    </div>
  );
}
