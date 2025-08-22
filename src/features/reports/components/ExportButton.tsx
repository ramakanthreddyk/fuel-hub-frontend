
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => Promise<void>;
  type?: 'csv' | 'pdf' | 'excel';
  disabled?: boolean;
  label?: string;
}

export function ExportButton({ 
  onExport, 
  type = 'csv', 
  disabled = false,
  label 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Show initial toast
      toast({
        title: 'Export Started',
        description: `Preparing your ${type.toUpperCase()} file...`,
      });

      await onExport();
      
      // Show success toast
      toast({
        title: 'Export Ready',
        description: `Your ${type.toUpperCase()} file has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: `Unable to export ${type.toUpperCase()} file. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 mr-2" />;
      default: return <Download className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant="outline"
      className="bg-white"
    >
      {getIcon()}
      {isExporting ? 'Exporting...' : (label || `Export ${type.toUpperCase()}`)}
    </Button>
  );
}
