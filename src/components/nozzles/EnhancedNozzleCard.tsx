
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Activity, Settings, Zap, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzlesApi, UpdateNozzleRequest, Nozzle } from '@/api/nozzles';
import { useToast } from '@/hooks/use-toast';

interface EnhancedNozzleCardProps {
  nozzle: Nozzle;
  onTakeReading?: (nozzleId: string) => void;
}

export function EnhancedNozzleCard({ nozzle, onTakeReading }: EnhancedNozzleCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateNozzleRequest>({
    defaultValues: {
      fuelType: nozzle.fuelType,
      status: nozzle.status
    }
  });

  const updateNozzleMutation = useMutation({
    mutationFn: (data: UpdateNozzleRequest) => nozzlesApi.updateNozzle(nozzle.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nozzles', nozzle.pumpId] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Nozzle updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update nozzle",
        variant: "destructive",
      });
    }
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'maintenance':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return 'from-green-500 to-emerald-600';
      case 'diesel':
        return 'from-amber-500 to-orange-600';
      case 'premium':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const onSubmit = (data: UpdateNozzleRequest) => {
    updateNozzleMutation.mutate(data);
  };

  const isOperational = nozzle.status === 'active';

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg",
                `bg-gradient-to-br ${getFuelTypeColor(nozzle.fuelType)}`
              )}>
                <Droplets className="h-6 w-6 text-white" />
                {nozzle.status === 'maintenance' && (
                  <div className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Nozzle #{nozzle.nozzleNumber}
                </CardTitle>
                <p className="text-sm text-gray-500 font-medium capitalize">{nozzle.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(nozzle.status)} className="gap-1">
                {getStatusIcon(nozzle.status)}
                {nozzle.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Enhanced Nozzle Visual */}
          <div className="relative p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border">
            <div className="flex items-center justify-center">
              {/* Nozzle Assembly */}
              <div className="relative">
                {/* Hose */}
                <div className="w-24 h-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full shadow-lg" />
                
                {/* Nozzle Handle */}
                <div className="absolute -right-6 -top-3 w-10 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-xl">
                  {/* Grip Pattern */}
                  <div className="absolute inset-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-md">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-6 h-0.5 bg-slate-500 mb-0.5" />
                      <div className="w-6 h-0.5 bg-slate-500 mb-0.5" />
                      <div className="w-6 h-0.5 bg-slate-500" />
                    </div>
                  </div>
                  
                  {/* Digital Counter */}
                  <div className="absolute -top-6 -left-1 w-8 h-4 bg-black rounded border border-slate-600 flex items-center justify-center">
                    <div className={cn(
                      "text-[8px] font-mono font-bold transition-colors duration-300",
                      isOperational ? "text-green-400" : "text-red-400"
                    )}>
                      {isOperational ? "RDY" : "OFF"}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={cn(
                    "absolute -bottom-1 left-3 w-2 h-2 rounded-full transition-all duration-300",
                    isOperational ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" : 
                    nozzle.status === 'maintenance' ? "bg-amber-400" : "bg-gray-400"
                  )} />
                </div>
                
                {/* Connection Point */}
                <div className="absolute -left-3 top-0.5 w-4 h-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full shadow-md" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Zap className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm font-bold text-blue-700 capitalize">{nozzle.fuelType}</div>
                <div className="text-xs text-blue-600">Fuel Type</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <Activity className="h-4 w-4 text-emerald-600" />
              <div>
                <div className="text-sm font-bold text-emerald-700 capitalize">{nozzle.status}</div>
                <div className="text-xs text-emerald-600">Status</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {onTakeReading && (
            <Button 
              onClick={() => onTakeReading(nozzle.id)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={nozzle.status === 'maintenance'}
            >
              <Activity className="h-4 w-4 mr-2" />
              Take Reading
            </Button>
          )}

          {nozzle.status === 'maintenance' && (
            <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm font-semibold text-amber-800 flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Under Maintenance
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nozzle #{nozzle.nozzleNumber}</DialogTitle>
            <DialogDescription>
              Update the fuel type and status of this nozzle
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
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
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateNozzleMutation.isPending}>
                  {updateNozzleMutation.isPending ? "Updating..." : "Update Nozzle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
