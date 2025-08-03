import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  DollarSign, 
  Gauge, 
  Users, 
  Calculator,
  X
} from 'lucide-react';

interface FloatingAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const actions: FloatingAction[] = [
  {
    label: 'Cash Report',
    href: '/dashboard/cash-reports/simple',
    icon: DollarSign,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    label: 'Reading',
    href: '/dashboard/readings/new',
    icon: Gauge,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    label: 'Creditor',
    href: '/dashboard/creditors/new',
    icon: Users,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    label: 'Reconcile',
    href: '/dashboard/reconciliation',
    icon: Calculator,
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            onClick={() => setIsOpen(false)}
          >
            <Button
              size="sm"
              className={cn(
                "h-12 px-4 shadow-lg text-white border-0",
                action.color
              )}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-red-500 hover:bg-red-600 rotate-45" 
            : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
}