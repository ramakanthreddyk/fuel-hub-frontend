
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, AlertCircle, Users, Plus } from 'lucide-react';

const mockCreditors = [
  {
    id: '1',
    name: 'ABC Transport Ltd.',
    totalCredit: 125_000,
    lastPayment: 25_000,
    lastPaymentDate: '2024-01-10',
    status: 'active',
    creditLimit: 150_000,
    phone: '+91 98765 43210'
  },
  {
    id: '2',
    name: 'XYZ Logistics',
    totalCredit: 87_500,
    lastPayment: 15_000,
    lastPaymentDate: '2024-01-12',
    status: 'overdue',
    creditLimit: 100_000,
    phone: '+91 87654 32109'
  },
  {
    id: '3',  
    name: 'Quick Delivery Co.',
    totalCredit: 45_200,
    lastPayment: 12_000,
    lastPaymentDate: '2024-01-14',
    status: 'active',
    creditLimit: 75_000,
    phone: '+91 76543 21098'
  }
];

export default function CreditorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creditors</h1>
          <p className="text-muted-foreground">
            Manage customer credit accounts and payment tracking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Creditor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creditors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +3 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,57,700</div>
            <p className="text-xs text-muted-foreground">
              Across all creditors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Collection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,24,500</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Creditors List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCreditors.map((creditor) => (
          <Card key={creditor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{creditor.name}</CardTitle>
                <Badge variant={creditor.status === 'active' ? 'default' : 'destructive'}>
                  {creditor.status}
                </Badge>
              </div>
              <CardDescription>
                {creditor.phone}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Outstanding:</span>
                  <span className="font-medium text-red-600">
                    ₹{creditor.totalCredit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Credit Limit:</span>
                  <span className="font-medium">
                    ₹{creditor.creditLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Payment:</span>
                  <span className="font-medium text-green-600">
                    ₹{creditor.lastPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Date:</span>
                  <span>{creditor.lastPaymentDate}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View History
                </Button>
                <Button size="sm" className="flex-1">
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
