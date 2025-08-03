import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Gauge, 
  Users, 
  DollarSign,
  Plus,
  Calculator
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Submit Cash Report',
      description: 'Report daily cash collection',
      icon: DollarSign,
      href: '/dashboard/cash-reports/simple',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Record Reading',
      description: 'Add nozzle readings',
      icon: Gauge,
      href: '/dashboard/readings/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Add Creditor',
      description: 'Register new creditor',
      icon: Users,
      href: '/dashboard/creditors/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Reconciliation',
      description: 'Check daily reconciliation',
      icon: Calculator,
      href: '/dashboard/reconciliation',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}