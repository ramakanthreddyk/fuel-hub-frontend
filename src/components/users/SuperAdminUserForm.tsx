
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateSuperAdminRequest, User } from '@/api/api-contract';

interface SuperAdminUserFormProps {
  user?: User;
  onSubmit: (data: CreateSuperAdminRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SuperAdminUserForm({ user, onSubmit, onCancel, isLoading }: SuperAdminUserFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateSuperAdminRequest>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: 'superadmin',
      password: ''
    }
  });

  const watchedRole = watch('role');

  const handleFormSubmit = (data: CreateSuperAdminRequest) => {
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
              onValueChange={(value: 'superadmin') => setValue('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">SuperAdmin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
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
