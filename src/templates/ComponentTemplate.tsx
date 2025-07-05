/**
 * @file ComponentTemplate.tsx
 * @description Template for components using the API hook
 */
import { useState } from 'react';
import { useFetchData, useApiMutation, apiEndpoints } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define your data interface
interface DataItem {
  id: string;
  name: string;
  // Add other properties as needed
}

export default function ComponentTemplate() {
  const endpoints = apiEndpoints;
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Fetch data example
  const { data = [], isLoading } = useFetchData<DataItem[]>(
    endpoints.stations,
    ['some-data'],
    {
      // Additional options
      enabled: true,
      refetchOnWindowFocus: false,
      select: (data) => {
        // Transform data if needed
        return data;
      }
    }
  );
  
  // Create mutation example
  const mutation = useApiMutation<DataItem, { name: string }>(
    endpoints.stations,
    {
      method: 'POST',
      invalidateQueries: [['some-data']],
      onSuccess: (data) => {
        console.log('Item created:', data);
      },
      onError: (error) => {
        console.error('Error creating item:', error);
      }
    }
  );
  
  // Handle create item
  const handleCreate = () => {
    mutation.mutate({ name: 'New Item' });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Component Title</h1>
        <Button onClick={handleCreate}>Create Item</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Item content */}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {data.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first item.
            </p>
            <Button onClick={handleCreate}>Create Item</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
