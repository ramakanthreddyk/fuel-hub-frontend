
/**
 * @file UsersPage.tsx
 * @description User management page component
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for user management
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Users, Edit, Trash2, Key, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserForm } from '@/components/users/UserForm';
import { ResetPasswordForm } from '@/components/users/ResetPasswordForm';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useResetPassword } from '@/hooks/api/useUsers';
import { User, CreateUserRequest, UpdateUserRequest, ResetPasswordRequest } from '@/api/services/usersService';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Use the new API hooks
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();

  const handleCreateUser = (userData: CreateUserRequest) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create user",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateUser = (userId: string, userData: UpdateUserRequest) => {
    updateUser.mutate({ userId, data: userData }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update user",
          variant: "destructive",
        });
      }
    });
  };

  const handleResetPassword = (userId: string, passwordData: { newPassword: string; confirmPassword: string }) => {
    const resetPasswordData: ResetPasswordRequest = {
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    };
    
    resetPassword.mutate({ userId, data: resetPasswordData }, {
      onSuccess: () => {
        setIsResetPasswordDialogOpen(false);
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUserIdToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userIdToDelete) return;
    deleteUser.mutate(userIdToDelete, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
      },
    });
    setUserIdToDelete(null);
  };

  // Handle error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading users: {(error as Error).message}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles within the tenant</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account for this tenant
              </DialogDescription>
            </DialogHeader>
            <UserForm 
              onSubmit={handleCreateUser} 
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createUser.isPending} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
          <CardDescription>
            Manage user accounts and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.stationName || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsResetPasswordDialogOpen(true);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found. Create your first user to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={(userData) => handleUpdateUser(selectedUser.id, userData)}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateUser.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <ResetPasswordForm
              onSubmit={(passwordData) => handleResetPassword(selectedUser.id, passwordData)}
              onCancel={() => setIsResetPasswordDialogOpen(false)}
              isLoading={resetPassword.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserIdToDelete(null)}
      />
    </div>
  );
}
