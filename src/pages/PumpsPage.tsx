
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PumpsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pumps</h1>
        <p className="text-muted-foreground">Monitor and manage fuel pumps</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pump Management</CardTitle>
          <CardDescription>View and manage fuel pumps across your stations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pump management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PumpsPage;
