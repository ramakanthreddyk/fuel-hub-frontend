
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useTopCreditors } from '@/hooks/useCreditors';
import { CreditCard, AlertTriangle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { TopCreditor } from '@/api/api-contract';

export function TopCreditorsTable() {
  const { data: creditors = [], isLoading, isError } = useTopCreditors();
  const [selectedCreditor, setSelectedCreditor] = useState<TopCreditor | null>(null);
  
  console.log('[TOP-CREDITORS] Data:', creditors, 'Loading:', isLoading, 'Error:', isError);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Top Creditors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditors || !Array.isArray(creditors) || creditors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Top Creditors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No credit sales recorded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (outstanding: number, limit?: number) => {
    if (!limit) return 'bg-gray-100 text-gray-800';
    const percentage = (outstanding / limit) * 100;
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (outstanding: number, limit?: number) => {
    if (!limit) return 'No Limit';
    const percentage = (outstanding / limit) * 100;
    if (percentage >= 90) return 'Critical';
    if (percentage >= 70) return 'Warning';
    return 'Good';
  };

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-600" />
          Top Creditors by Outstanding Amount
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party Name</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditors.map((creditor) => (
              <TableRow key={creditor.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{creditor.partyName}</div>
                    {(creditor as any).lastTransactionDate && (
                      <div className="text-xs text-muted-foreground">
                        Last transaction: {format(new Date((creditor as any).lastTransactionDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ₹{creditor.outstandingAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusColor(creditor.outstandingAmount, creditor.creditLimit)}>
                    {getStatusText(creditor.outstandingAmount, creditor.creditLimit)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCreditor(creditor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Creditor Details</DialogTitle>
                        <DialogDescription>Information about the selected creditor</DialogDescription>
                      </DialogHeader>
                      {selectedCreditor && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">{selectedCreditor.partyName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Outstanding: ₹{selectedCreditor.outstandingAmount.toLocaleString()}
                            </p>
                            {selectedCreditor.creditLimit && (
                              <p className="text-sm text-muted-foreground">
                                Credit Limit: ₹{selectedCreditor.creditLimit.toLocaleString()}
                              </p>
                            )}
                          </div>
                          
                          {(selectedCreditor as any).lastTransactionDate && (
                            <div>
                              <span className="text-sm font-medium">Last Transaction: </span>
                              <span className="text-sm">
                                {format(new Date((selectedCreditor as any).lastTransactionDate), 'PPP')}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">
                              Requires attention for payment collection
                            </span>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
