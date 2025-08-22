/**
 * @file ResetPasswordPage.tsx
 * @description Admin page to reset user passwords
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/api/useUsers';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { ArrowLeft, Key, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Get current user from localStorage
  let currentUser = null;
  try {
    const storedUser = localStorage.getItem('fuelsync_user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    currentUser = null;
  }

  // SuperAdmin fetches all users using superAdminApi
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === 'superadmin') {
      setAllUsersLoading(true);
      import('@/api/superadmin').then(({ superAdminApi }) => {
        superAdminApi.getAdminUsers().then((result) => {
          // Combine adminUsers and tenantUsers for dropdown
          setAllUsers([...(result.adminUsers || []), ...(result.tenantUsers || [])]);
        }).finally(() => setAllUsersLoading(false));
      });
    }
  }, [currentUser]);

  const { data: users = [], isLoading: usersLoading } = useUsers();

  // Filter users based on role
  let filteredUsers = users;
  if (currentUser) {
    if (currentUser.role === 'owner') {
      filteredUsers = users.filter(
        (user) =>
          user.tenantId === currentUser.tenantId &&
          user.role !== 'owner'
      );
    } else if (currentUser.role === 'superadmin') {
      filteredUsers = allUsers;
    } else {
      filteredUsers = [];
    }
  }

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      // Use usersService.resetPassword for API call
      await import('@/api/services/usersService').then(({ default: usersService }) => {
        return usersService.resetPassword(userId, {
          newPassword: password,
          confirmPassword: password
        });
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password reset successfully'
      });
      setSelectedUserId('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reset password',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast({
        title: 'Error',
        description: 'Please select a user',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    resetPasswordMutation.mutate({ userId: selectedUserId, password: newPassword });
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <h1 className="text-2xl font-bold">Reset User Password</h1>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Reset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {(usersLoading || allUsersLoading) ? (
                    <SelectItem value="loading" disabled>Loading users...</SelectItem>
                  ) : (
                    filteredUsers.length === 0 ? (
                      <SelectItem value="none" disabled>No users available</SelectItem>
                    ) : (
                      filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </SelectItem>
                      ))
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <div><strong>Name:</strong> {selectedUser.name}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Role:</strong> {selectedUser.role}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={resetPasswordMutation.isPending || !selectedUserId}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}