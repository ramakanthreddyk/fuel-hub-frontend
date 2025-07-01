
import { toast as sonnerToast } from 'sonner';

// Simple toast hook that works with sonner
export function useToast() {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      if (options.variant === 'destructive') {
        sonnerToast.error(options.title || 'Error', {
          description: options.description,
        });
      } else {
        sonnerToast.success(options.title || 'Success', {
          description: options.description,
        });
      }
    },
  };
}

// Export a direct toast function that matches the expected API
export const toast = (options: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => {
  if (options.variant === 'destructive') {
    sonnerToast.error(options.title || 'Error', {
      description: options.description,
    });
  } else {
    sonnerToast.success(options.title || 'Success', {
      description: options.description,
    });
  }
};
