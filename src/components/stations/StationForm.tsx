
/**
 * @file components/stations/StationForm.tsx
 * @description Station form component with improved mobile layout and field grouping
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Phone, Mail, Loader2 } from 'lucide-react';

interface StationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  managerName?: string;
  description?: string;
}

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
}: StationFormProps) {
  const form = useForm<StationFormData>({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      email: '',
      managerName: '',
      description: '',
      ...initialData
    }
  });

  const handleSubmit = (data: StationFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the station"
                rows={3}
                {...form.register('description')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Details
          </CardTitle>
          <CardDescription>Station address and location information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              placeholder="Enter street address"
              {...form.register('address', { required: 'Address is required' })}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter city"
                {...form.register('city', { required: 'City is required' })}
              />
              {form.formState.errors.city && (
                <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="Enter state"
                {...form.register('state', { required: 'State is required' })}
              />
              {form.formState.errors.state && (
                <p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                placeholder="Enter postal code"
                {...form.register('postalCode', { required: 'Postal code is required' })}
              />
              {form.formState.errors.postalCode && (
                <p className="text-sm text-red-600">{form.formState.errors.postalCode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Contact details and manager information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                {...form.register('phone')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...form.register('email')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="managerName">Manager Name</Label>
            <Input
              id="managerName"
              placeholder="Enter manager name"
              {...form.register('managerName')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="order-2 sm:order-1"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="order-1 sm:order-2"
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
      </div>
    </form>
  );
}
