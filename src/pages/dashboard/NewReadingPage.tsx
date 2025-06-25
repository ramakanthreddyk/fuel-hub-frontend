
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewReadingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Button onClick={() => navigate(-1)} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">New Reading</h1>
        <p className="text-muted-foreground">Record nozzle reading to auto-generate sale</p>
      </div>

      <ReadingEntryForm />
    </div>
  );
}
