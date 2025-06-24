
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Shield, Mail, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';

export default function SettingsPage() {
  const { user } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800 border-red-200';
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attendant': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <Shield className="w-4 h-4 mr-1" />;
      case 'owner': return <Shield className="w-4 h-4 mr-1" />;
      case 'manager': return <User className="w-4 h-4 mr-1" />;
      case 'attendant': return <User className="w-4 h-4 mr-1" />;
      default: return <User className="w-4 h-4 mr-1" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                {getRoleIcon(user.role)}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">Full Name</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">{user.email}</div>
                <div className="text-sm text-muted-foreground">Email Address</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleIcon(user.role)}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <div className="text-sm text-muted-foreground">Role</div>
              </div>
            </div>

            {user.tenantName && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{user.tenantName}</div>
                  <div className="text-sm text-muted-foreground">Organization</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <ChangePasswordForm />
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Security information and account status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Account Status</div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Role Permissions</div>
              <div className="text-sm text-muted-foreground">
                {user.role === 'owner' && "Full access to all features and user management"}
                {user.role === 'manager' && "Access to stations, sales, and operational features"}
                {user.role === 'attendant' && "Access to sales recording and basic features"}
                {user.role === 'superadmin' && "Platform-wide administrative access"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
