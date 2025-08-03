
/**
 * @file components/creditors/CreditorCard.tsx
 * @description Clean, compact creditor card with essential information
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Plus,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface CreditorCardProps {
  creditor: {
    id: string;
    name: string;
    phone?: string;
    creditLimit: number;
    currentBalance: number;
    creditUtilization?: number;
    status: 'active' | 'inactive';
    stationName?: string;
  };
  onViewDetails: (creditorId: string) => void;
  onAddPayment: (creditorId: string) => void;
}

export function CreditorCard({ creditor, onViewDetails, onAddPayment }: CreditorCardProps) {
  const isOverLimit = creditor.currentBalance > creditor.creditLimit;
  const isNearLimit = creditor.currentBalance > creditor.creditLimit * 0.8;
  const utilizationPercent = creditor.creditUtilization || (creditor.creditLimit > 0 ? (creditor.currentBalance / creditor.creditLimit) * 100 : 0);
  
  const getStatusColor = () => {
    if (creditor.status === 'inactive' || isOverLimit) return 'destructive';
    if (isNearLimit) return 'secondary';
    return 'default';
  };

  const getStatusLabel = () => {
    if (creditor.status === 'inactive') return 'Inactive';
    if (isOverLimit) return 'Over Limit';
    if (isNearLimit) return 'Near Limit';
    return 'Active';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{creditor.name}</h3>
              {creditor.phone && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {creditor.phone}
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant={getStatusColor() as any}
            className="text-xs"
          >
            {isOverLimit || isNearLimit ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {getStatusLabel()}
          </Badge>
        </div>

        {/* Balance & Limit */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Balance</div>
            <div className={cn(
              "text-sm font-bold",
              isOverLimit ? "text-red-600" : "text-foreground"
            )}>
              {formatCurrency(creditor.currentBalance)}
            </div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Limit</div>
            <div className="text-sm font-bold">
              {formatCurrency(creditor.creditLimit)}
            </div>
          </div>
        </div>

        {/* Utilization Bar */}
        {creditor.creditLimit > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Utilization</span>
              <span>{utilizationPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  utilizationPercent > 100 ? "bg-red-500" :
                  utilizationPercent > 80 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Station Info */}
        {creditor.stationName && (
          <div className="text-xs text-muted-foreground mb-3">
            Station: {creditor.stationName}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => onViewDetails(creditor.id)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => onAddPayment(creditor.id)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
