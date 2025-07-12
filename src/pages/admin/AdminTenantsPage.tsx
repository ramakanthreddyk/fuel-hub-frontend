
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminTenantsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <p className="text-muted-foreground">Manage tenant organizations and their configurations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>View and manage all tenant organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tenant management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTenantsPage;
