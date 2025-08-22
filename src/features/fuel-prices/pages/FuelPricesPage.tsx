
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FuelPricesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Fuel Prices</h1>
        <p className="text-muted-foreground">Manage fuel pricing across stations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Price Management</CardTitle>
          <CardDescription>Set and monitor fuel prices across your network</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fuel price management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuelPricesPage;
