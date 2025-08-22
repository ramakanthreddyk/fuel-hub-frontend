
/**
 * @file components/stations/StationForm.tsx
 * @description Station form component with improved mobile layout and field grouping
 */
import type { Station } from '@/api/api-contract';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Loader2 } from 'lucide-react';

type StationFormData = Pick<Station, 'name' | 'address'>;

interface StationFormProps {
  onSubmit: (data: StationFormData) => void;
  isLoading: boolean;
  initialData?: Partial<StationFormData>;
  title?: string;
  description?: string;
}

export function StationForm({ 
  onSubmit,
  isLoading,
  initialData = {},
  title = "Station Information",
  description = "Enter the station details below"
}: Readonly<StationFormProps>) {
  const form = useForm<StationFormData>({
    defaultValues: {
      name: '',
      address: '',
      ...initialData
    }
  });

  const handleSubmit = (data: StationFormData) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Station Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter station name"
                  {...form.register('name', { required: 'Station name is required' })}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter station address (optional)"
                  rows={3}
                  {...form.register('address')}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Station'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
