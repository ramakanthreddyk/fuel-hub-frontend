
// import { useState } from 'react'; // Removed unused import
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateUserRequest, User } from '@/api/api-contract';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: Readonly<UserFormProps>) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateUserRequest>({
    defaultValues: {
  name: user?.name || '',
  email: user?.email || '',
  role: (user?.role as 'superadmin' | 'owner' | 'manager' | 'attendant') || 'attendant',
    }
  });

  const watchedRole = watch('role');

  const handleFormSubmit = (data: CreateUserRequest) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{user ? 'Edit User' : 'Create New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={watchedRole}
              onValueChange={(value: 'manager' | 'attendant') => setValue('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendant">Attendant</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* No password field in CreateUserRequest contract */}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {(() => {
                if (isLoading) return 'Saving...';
                if (user) return 'Update User';
                return 'Create User';
              })()}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
