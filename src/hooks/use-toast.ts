
import { toast as sonnerToast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

// Simple toast hook that works with sonner
export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      const { title = '', description = '', variant = 'default' } = options;
      
      switch (variant) {
        case 'destructive':
          sonnerToast.error(title || 'Error', {
            description,
          });
          break;
        case 'success':
          sonnerToast.success(title || 'Success', {
            description,
          });
          break;
        default:
          sonnerToast.info(title || 'Info', {
            description,
          });
      }
    },
  };
}

// Export a direct toast function for convenience
export const toast = (options: ToastOptions) => {
  const { title = '', description = '', variant = 'default' } = options;
  
  switch (variant) {
    case 'destructive':
      sonnerToast.error(title || 'Error', {
        description,
      });
      break;
    case 'success':
      sonnerToast.success(title || 'Success', {
        description,
      });
      break;
    default:
      sonnerToast.info(title || 'Info', {
        description,
      });
  }
};
