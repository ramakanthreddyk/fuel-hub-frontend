
import { toast as sonnerToast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Simple toast hook that works with sonner
export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      const {
        title = '',
        description = '',
        variant = 'default',
        duration,
        action
      } = options;

      const toastOptions = {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      };

      switch (variant) {
        case 'destructive':
          return sonnerToast.error(title || 'Error', toastOptions);
        case 'success':
          return sonnerToast.success(title || 'Success', toastOptions);
        case 'warning':
          return sonnerToast.warning(title || 'Warning', toastOptions);
        case 'info':
          return sonnerToast.info(title || 'Info', toastOptions);
        default:
          return sonnerToast(title || 'Notification', toastOptions);
      }
    },
  };
}

// Export a direct toast function for convenience
export const toast = (options: ToastOptions) => {
  const {
    title = '',
    description = '',
    variant = 'default',
    duration,
    action
  } = options;

  const toastOptions = {
    description,
    duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  };

  switch (variant) {
    case 'destructive':
      return sonnerToast.error(title || 'Error', toastOptions);
    case 'success':
      return sonnerToast.success(title || 'Success', toastOptions);
    case 'warning':
      return sonnerToast.warning(title || 'Warning', toastOptions);
    case 'info':
      return sonnerToast.info(title || 'Info', toastOptions);
    default:
      return sonnerToast(title || 'Notification', toastOptions);
  }
};
