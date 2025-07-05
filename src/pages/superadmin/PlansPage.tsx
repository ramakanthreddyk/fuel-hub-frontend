import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import { superadminApi } from '@/api/superadmin';
import { Plan } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';
import { PlanForm } from '@/components/admin/PlanForm';
import { formatCurrency } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function PlansPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: superadminApi.getPlans
  });

  // Ensure plans is always an array
  const plans = Array.isArray(plansData) ? plansData : [];

  const createPlanMutation = useMutation({
    mutationFn: superadminApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Plan created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create plan",
        variant: "destructive",
      });
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, planData }: { planId: string; planData: Partial<Plan> }) => 
      superadminApi.updatePlan(planId, planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setIsEditDialogOpen(false);
      setEditingPlan(null);
      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update plan",
        variant: "destructive",
      });
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => superadminApi.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete plan",
        variant: "destructive",
      });
    }
  });

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = (data: any) => {
    if (!editingPlan) return;
    
    updatePlanMutation.mutate({
      planId: editingPlan.id,
      planData: data
    });
  };

  const handleCreatePlan = (data: any) => {
    createPlanMutation.mutate(data);
  };

  const handleDeletePlan = (planId: string) => {
    setPlanIdToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePlan = () => {
    if (!planIdToDelete) return;
    deletePlanMutation.mutate(planIdToDelete);
    setPlanIdToDelete(null);
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan Management</h1>
          <p className="text-muted-foreground">Configure subscription plans and pricing</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan for tenants
              </DialogDescription>
            </DialogHeader>
            <PlanForm
              isLoading={createPlanMutation.isPending}
              onSubmit={handleCreatePlan}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscription Plans
          </CardTitle>
          <CardDescription>
            Manage pricing, features, and limits for each plan tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Max Stations</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead>Yearly Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <Badge className={getPlanColor(plan.name)}>
                          {plan.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{plan.maxStations}</TableCell>
                      <TableCell>{formatCurrency(plan.priceMonthly)}</TableCell>
                      <TableCell>{formatCurrency(plan.priceYearly)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {plan.features?.length || 0} features
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No plans found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update plan pricing and features
            </DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <PlanForm
              initialData={editingPlan}
              onSubmit={handleUpdatePlan}
              isLoading={updatePlanMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeletePlan}
        onCancel={() => setPlanIdToDelete(null)}
      />
    </div>
  );
}
