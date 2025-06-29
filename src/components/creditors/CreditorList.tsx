
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Phone, User, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Creditor } from '@/api/api-contract';

interface CreditorListProps {
  creditors: Creditor[];
  isLoading: boolean;
}

export function CreditorList({ creditors, isLoading }: CreditorListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (creditors.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Creditors Found</h3>
          <p className="text-muted-foreground">
            Add your first creditor to start managing credit sales.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCreditUtilization = (creditor: Creditor) => {
    if (!creditor.creditLimit || creditor.creditLimit === 0) return 0;
    return ((creditor.outstandingAmount || 0) / creditor.creditLimit) * 100;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-100 text-red-800';
    if (utilization >= 80) return 'bg-yellow-100 text-yellow-800';
    if (utilization >= 50) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-4">
      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {creditors.map((creditor) => {
          const utilization = getCreditUtilization(creditor);
          return (
            <Card key={creditor.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{creditor.partyName}</h3>
                    {creditor.contactPerson && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {creditor.contactPerson}
                      </div>
                    )}
                    {creditor.phoneNumber && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {creditor.phoneNumber}
                      </div>
                    )}
                  </div>
                  {creditor.creditLimit && creditor.creditLimit > 0 && (
                    <Badge className={getUtilizationColor(utilization)}>
                      {utilization.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Outstanding</div>
                    <div className="font-semibold text-red-600">
                      ₹{(creditor.outstandingAmount || 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Credit Limit</div>
                    <div className="font-semibold">
                      {creditor.creditLimit ? `₹${creditor.creditLimit.toLocaleString()}` : 'Unlimited'}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/dashboard/creditors/${creditor.id}/payments`}>
                      Record Payment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditors.map((creditor) => {
              const utilization = getCreditUtilization(creditor);
              return (
                <TableRow key={creditor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{creditor.partyName}</div>
                      {creditor.notes && (
                        <div className="text-sm text-muted-foreground">{creditor.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {creditor.contactPerson && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {creditor.contactPerson}
                        </div>
                      )}
                      {creditor.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {creditor.phoneNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-red-600">
                      ₹{(creditor.outstandingAmount || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {creditor.creditLimit ? `₹${creditor.creditLimit.toLocaleString()}` : 'Unlimited'}
                  </TableCell>
                  <TableCell>
                    {creditor.creditLimit && creditor.creditLimit > 0 ? (
                      <Badge className={getUtilizationColor(utilization)}>
                        {utilization.toFixed(0)}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/dashboard/creditors/${creditor.id}/payments`}>
                          <IndianRupee className="h-3 w-3 mr-1" />
                          Payment
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
