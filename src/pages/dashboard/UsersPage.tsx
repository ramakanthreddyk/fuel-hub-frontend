import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Users, Trash2, MapPin, Shield, KeyRound } from 'lucide-react';
import { usersApi, CreateUserRequest, ResetPasswordRequest } from '@/api/users';
import { stationsApi } from '@/api/stations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'attendant',
    stationId: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Check if current user is owner
  const isOwner = user?.role === 'owner';
  const canManageUsers = isOwner;

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers
  });

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations()
  });

  const createUserMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateDialogOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'attendant', stationId: '' });
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

  const resetPasswordMutation = useMutation({
    mutationFn: ({ userId, passwordData }: { userId: string; passwordData: ResetPasswordRequest }) => 
      usersApi.resetPassword(userId, passwordData),
    onSuccess: () => {
      setIsResetPasswordDialogOpen(false);
      setSelectedUserId('');
      setNewPassword('');
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

  const deleteUserMutation = useMutation({
    mutationFn: usersApi.deleteUser,
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
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(newUser);
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }
    resetPasswordMutation.mutate({
      userId: selectedUserId,
      passwordData: { newPassword }
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attendant': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Shield className="w-3 h-3 mr-1" />;
      case 'manager': return <Users className="w-3 h-3 mr-1" />;
      case 'attendant': return <UserPlus className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            {canManageUsers ? "Manage employees and their station assignments" : "View team members and their roles"}
          </p>
        </div>
        
        {canManageUsers && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new employee to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="attendant">Attendant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="station">Station Assignment</Label>
                  <Select value={newUser.stationId} onValueChange={(value) => setNewUser({ ...newUser, stationId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific station</SelectItem>
                      {stations?.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for this user
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            {canManageUsers ? "All employees in your organization" : "View team members and their roles"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Created</TableHead>
                  {canManageUsers && <TableHead className="w-[150px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.stationName ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.stationName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">All stations</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    {canManageUsers && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setIsResetPasswordDialogOpen(true);
                            }}
                            title="Reset Password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          {user.role !== 'owner' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {(!users || users.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={canManageUsers ? 6 : 5} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
