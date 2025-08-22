
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StationsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stations</h1>
        <p className="text-muted-foreground">Manage your fuel stations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Station Management</CardTitle>
          <CardDescription>View and manage all fuel stations in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Station management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StationsPage;
