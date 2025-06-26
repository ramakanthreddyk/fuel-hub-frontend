
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { stationsApi } from '@/api/stations';
import { useToast } from '@/hooks/use-toast';

interface CreateStationDialogProps {
  children?: React.ReactNode;
}

export function CreateStationDialog({ children }: CreateStationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createStationMutation = useMutation({
    mutationFn: stationsApi.createStation,
    onSuccess: (data) => {
      console.log('Station created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setOpen(false);
      setFormData({ name: '', address: '' });
      toast({
        title: "Success",
        description: "Station created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create station:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message || 
                          error.message || 
                          "Failed to create station";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Station name is required",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting station data:', formData);
    createStationMutation.mutate(formData);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Station</DialogTitle>
          <DialogDescription>
            Add a new fuel station to your network
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Station Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter station name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter station address"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createStationMutation.isPending}>
              {createStationMutation.isPending ? "Creating..." : "Create Station"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
