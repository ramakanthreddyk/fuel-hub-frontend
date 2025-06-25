import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { pumpsApi } from '@/api/pumps';
import { useToast } from '@/hooks/use-toast';

interface CreatePumpDialogProps {
  stationId: string;
  children?: React.ReactNode;
}

export function CreatePumpDialog({ stationId, children }: CreatePumpDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    serialNumber: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPumpMutation = useMutation({
    mutationFn: (data: any) => pumpsApi.createPump({ ...data, stationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pumps', stationId] });
      setOpen(false);
      setFormData({ label: '', serialNumber: '' });
      toast({
        title: "Success",
        description: "Pump created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create pump",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast({
        title: "Error",
        description: "Pump label is required",
        variant: "destructive",
      });
      return;
    }
    createPumpMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Pump
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Pump</DialogTitle>
          <DialogDescription>
            Add a new fuel pump to this station
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Pump Label *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Pump 1, A1, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="Enter pump serial number"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPumpMutation.isPending}>
              {createPumpMutation.isPending ? "Creating..." : "Create Pump"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}