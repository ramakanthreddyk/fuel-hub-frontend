
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CreditorsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Creditors</h1>
        <p className="text-muted-foreground">Manage credit accounts and payments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Creditor Management</CardTitle>
          <CardDescription>Track and manage credit accounts and outstanding payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Creditor management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditorsPage;
