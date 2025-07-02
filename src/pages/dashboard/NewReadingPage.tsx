
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';

export default function NewReadingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Reading Entry"
        description="Record a new pump reading for fuel sales tracking"
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard/readings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Readings
          </Button>
        }
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Reading Entry Form</CardTitle>
            <CardDescription>
              Select a station, pump, and nozzle to record the current fuel meter reading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReadingEntryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
