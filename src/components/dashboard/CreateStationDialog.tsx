
import { useState } from 'react';
import { useCreateStation } from '@/hooks/api/useStations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateStationDialogProps {
  children?: React.ReactNode;
}

interface CreateStationFormData {
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export default function CreateStationDialog({ children }: CreateStationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createStationMutation = useCreateStation();

  const form = useForm<CreateStationFormData>({
    defaultValues: {
      name: '',
      address: '',
      status: 'active'
    }
  });

  const handleSuccess = () => {
    setOpen(false);
    form.reset();
    toast({ title: 'Success', description: 'Station created successfully' });
  };

  const handleError = () => {
    toast({
      title: 'Error',
      description: 'Failed to create station',
      variant: 'destructive',
    });
  };

  const onSubmit = (data: CreateStationFormData) => {
    const payload = {
      name: data.name,
      address: data.address,
      city: '',
      state: '',
      postalCode: '',
    };
    createStationMutation.mutate(payload, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Station</DialogTitle>
          <DialogDescription>
            Add a new fuel station to your network
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter station name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter station address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createStationMutation.isPending}>
                {createStationMutation.isPending ? "Creating..." : "Create Station"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
