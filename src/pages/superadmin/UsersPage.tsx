
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Trash2, RotateCcw } from 'lucide-react';
import { usersApi } from '@/api/users';
import { CreateSuperAdminRequest, User } from '@/api/api-contract';
import { SuperAdminUserForm } from '@/components/users/SuperAdminUserForm';
import { ResetPasswordForm } from '@/components/users/ResetPasswordForm';

export default function UsersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'superadmin' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
  });

  const { mutateAsync: createUser } = useMutation({
    mutationFn: (data: CreateSuperAdminRequest) => usersApi.createSuperAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) => usersApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: ({ userId, passwordData }: { userId: string; passwordData: any }) => usersApi.resetPassword(userId, passwordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "Password reset email sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = async (formData: CreateSuperAdminRequest) => {
    try {
      // Ensure password is provided for user creation
      if (!formData.password) {
        toast({
          title: "Error",
          description: "Password is required for creating a new user",
          variant: "destructive",
        });
        return;
      }

      const userData: CreateSuperAdminRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'superadmin'
      };

      await createUser(userData);
      setShowCreateForm(false);
      setNewUser({ name: '', email: '', password: '', role: 'superadmin' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (formData: CreateSuperAdminRequest) => {
    try {
      if (!selectedUser) return;

      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      await updateUser({ userId: selectedUser.id, userData });
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleResetPassword = async (passwordData: any) => {
    try {
      if (!selectedUser) return;
      await resetPassword({ userId: selectedUser.id, passwordData });
      setShowResetPasswordForm(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>Add User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No users found.</TableCell>
                </TableRow>
              )}
              {!isLoading && users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy user ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowResetPasswordForm(true);
                        }}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showCreateForm && (
        <SuperAdminUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isLoading}
        />
      )}

      {selectedUser && !showResetPasswordForm && (
        <SuperAdminUserForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          onCancel={() => setSelectedUser(null)}
          isLoading={isLoading}
        />
      )}

      {showResetPasswordForm && selectedUser && (
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          onCancel={() => {
            setShowResetPasswordForm(false);
            setSelectedUser(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
