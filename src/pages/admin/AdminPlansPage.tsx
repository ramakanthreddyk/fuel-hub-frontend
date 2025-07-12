
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPlansPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Plan Management</h1>
        <p className="text-muted-foreground">Manage subscription plans and pricing</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Configure and manage subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plan management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlansPage;
