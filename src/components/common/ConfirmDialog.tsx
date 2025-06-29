
import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ConfirmDialogProps {
  /** Whether dialog is visible */
  open: boolean;
  /** Handler for open state change */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  variant?: 'default' | 'destructive';
  /** Icon type to display */
  iconType?: 'warning' | 'info' | 'success';
  /** Handler for confirm action */
  onConfirm: () => void;
  /** Handler for cancel action */
  onCancel?: () => void;
}

/**
 * Reusable confirmation dialog component
 * 
 * Features:
 * - Accessible dialog with proper focus management
 * - Customizable variants for different actions
 * - Icon support for visual context
 * - Keyboard navigation support
 * - Screen reader friendly
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  iconType = 'warning',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const icons = {
    warning: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-row items-center gap-3">
          <div aria-hidden="true">
            {icons[iconType]}
          </div>
          <div className="space-y-2">
            <AlertDialogTitle className="text-left">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="mt-0"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            variant={variant}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
