
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NozzlesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nozzles</h1>
        <p className="text-muted-foreground">Monitor fuel nozzles and readings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Nozzle Management</CardTitle>
          <CardDescription>View and manage fuel nozzles and their readings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nozzle management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NozzlesPage;
