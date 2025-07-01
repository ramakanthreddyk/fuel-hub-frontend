
import { toast } from 'sonner';

// Simple toast hook that works with sonner
export function useToast() {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      if (options.variant === 'destructive') {
        toast.error(options.title || 'Error', {
          description: options.description,
        });
      } else {
        toast.success(options.title || 'Success', {
          description: options.description,
        });
      }
    },
  };
}

// Export toast directly for convenience
export { toast };
