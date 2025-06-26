
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ResetPasswordRequest } from '@/api/api-contract';

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ResetPasswordForm({ onSubmit, onCancel, isLoading }: ResetPasswordFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordRequest>();

  const handleFormSubmit = (data: ResetPasswordRequest) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword', { required: 'New password is required' })}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
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
