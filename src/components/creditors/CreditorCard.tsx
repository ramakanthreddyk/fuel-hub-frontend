
/**
 * @file components/creditors/CreditorCard.tsx
 * @description Redesigned creditor card component with consistent styling
 */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColorfulCard, CardHeader, CardContent } from '@/components/ui/colorful-card';
import { 
  User, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Plus,
  DollarSign,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface CreditorCardProps {
  creditor: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    creditLimit: number;
    currentBalance: number;
    lastPaymentDate?: string;
    status: 'active' | 'suspended' | 'inactive';
  };
  onViewDetails: (creditorId: string) => void;
  onAddPayment: (creditorId: string) => void;
}

export function CreditorCard({ creditor, onViewDetails, onAddPayment }: CreditorCardProps) {
  const getStatusConfig = () => {
    const isOverLimit = creditor.currentBalance > creditor.creditLimit;
    const isNearLimit = creditor.currentBalance > creditor.creditLimit * 0.8;
    
    if (creditor.status === 'suspended' || isOverLimit) {
      return {
        gradient: 'from-red-50 via-pink-50 to-rose-50',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        label: isOverLimit ? 'Over Limit' : 'Suspended'
      };
    } else if (creditor.status === 'inactive') {
      return {
        gradient: 'from-gray-50 via-slate-50 to-zinc-50',
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: Clock,
        label: 'Inactive'
      };
    } else if (isNearLimit) {
      return {
        gradient: 'from-yellow-50 via-orange-50 to-amber-50',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: AlertTriangle,
        label: 'Near Limit'
      };
    } else {
      return {
        gradient: 'from-green-50 via-emerald-50 to-teal-50',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Active'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const utilizationPercent = (creditor.currentBalance / creditor.creditLimit) * 100;

  return (
    <ColorfulCard 
      gradient={statusConfig.gradient}
      className="transform hover:scale-[1.02] transition-all duration-200"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{creditor.name}</h3>
              {creditor.email && (
                <p className="text-xs text-slate-600">{creditor.email}</p>
              )}
              {creditor.phone && (
                <p className="text-xs text-slate-600">{creditor.phone}</p>
              )}
            </div>
          </div>
          
          <Badge className={cn("text-xs font-semibold", statusConfig.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-600">Balance</span>
            </div>
            <div className="text-lg font-bold text-slate-800">
              {formatCurrency(creditor.currentBalance)}
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-slate-600">Limit</span>
            </div>
            <div className="text-lg font-bold text-slate-800">
              {formatCurrency(creditor.creditLimit)}
            </div>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>Credit Utilization</span>
            <span>{utilizationPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                utilizationPercent > 100 ? "bg-red-500" :
                utilizationPercent > 80 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
            onClick={() => onViewDetails(creditor.id)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
            onClick={() => onAddPayment(creditor.id)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Payment
          </Button>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
