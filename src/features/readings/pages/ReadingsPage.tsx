
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReadingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Readings</h1>
        <p className="text-muted-foreground">Track fuel readings and consumption</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reading Management</CardTitle>
          <CardDescription>Monitor fuel readings and consumption patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reading management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingsPage;
