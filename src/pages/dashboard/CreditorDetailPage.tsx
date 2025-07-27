/**
 * @file pages/dashboard/CreditorDetailPage.tsx
 * @description Clean creditor detail page with proper data mapping
 */
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, User, Phone, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreditor } from '@/hooks/api/useCreditors';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export default function CreditorDetailPage() {
  const navigate = useNavigate();
  const { creditorId } = useParams<{ creditorId: string }>();
  const { data: creditor, isLoading, isError } = useCreditor(creditorId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !creditor) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Creditor not found</p>
        <Button onClick={() => navigate('/dashboard/creditors')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Creditors
        </Button>
      </div>
    );
  }

  // Normalize creditor data
  const normalizedCreditor = {
    id: creditor.id,
    name: creditor.partyName || creditor.party_name || creditor.name || 'Unknown',
    phone: creditor.contactNumber || creditor.contact_number || creditor.phoneNumber,
    address: creditor.address,
    creditLimit: Number(creditor.creditLimit || creditor.credit_limit || 0),
    currentBalance: Number(creditor.balance || creditor.currentBalance || 0),
    status: creditor.status === 'active' ? 'active' : 'inactive',
    stationName: creditor.stationName || creditor.station_name,
    createdAt: creditor.createdAt || creditor.created_at
  };

  const isOverLimit = normalizedCreditor.currentBalance > normalizedCreditor.creditLimit;
  const isNearLimit = normalizedCreditor.currentBalance > normalizedCreditor.creditLimit * 0.8;
  const utilizationPercent = normalizedCreditor.creditLimit > 0 
    ? (normalizedCreditor.currentBalance / normalizedCreditor.creditLimit) * 100 
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/creditors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{normalizedCreditor.name}</h1>
            <p className="text-muted-foreground">Creditor Details</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/dashboard/creditors/${creditorId}/payments/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={normalizedCreditor.status === 'active' ? 'default' : 'secondary'}>
                {normalizedCreditor.status === 'active' ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
                {normalizedCreditor.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credit Utilization</span>
                <span className={cn(
                  "font-medium",
                  isOverLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-green-600"
                )}>
                  {utilizationPercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all",
                    isOverLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                <div className={cn(
                  "text-lg font-bold",
                  isOverLimit ? "text-red-600" : "text-foreground"
                )}>
                  {formatCurrency(normalizedCreditor.currentBalance)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Credit Limit</div>
                <div className="text-lg font-bold">
                  {formatCurrency(normalizedCreditor.creditLimit)}
                </div>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 mb-1">Available Credit</div>
              <div className="text-lg font-bold text-green-800">
                {formatCurrency(Math.max(0, normalizedCreditor.creditLimit - normalizedCreditor.currentBalance))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Party Name</p>
              <p className="font-medium">{normalizedCreditor.name}</p>
            </div>
            
            {normalizedCreditor.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{normalizedCreditor.phone}</p>
                </div>
              </div>
            )}
            
            {normalizedCreditor.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{normalizedCreditor.address}</p>
              </div>
            )}
            
            {normalizedCreditor.stationName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Station</p>
                <p className="font-medium">{normalizedCreditor.stationName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}