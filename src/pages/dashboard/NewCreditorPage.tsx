/**
 * @file pages/dashboard/NewCreditorPage.tsx
 * @description Page for adding new creditors
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CreditorForm } from '@/components/creditors/CreditorForm';
import { useToast } from '@/hooks/use-toast';

export default function NewCreditorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: 'Creditor Added',
      description: 'The creditor has been successfully added.',
      variant: 'success',
    });
    navigate('/dashboard/creditors');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/creditors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Creditors
          </Button>
          <h1 className="text-2xl font-bold">Add New Creditor</h1>
        </div>
      </div>
      
      <CreditorForm onSuccess={handleSuccess} />
    </div>
  );
}