
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SalesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sales</h1>
        <p className="text-muted-foreground">Track sales and revenue</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
          <CardDescription>Monitor sales performance and revenue across stations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sales management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
