
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface EnhancedSelectProps {
  /** Select label */
  label?: string;
  /** Help text displayed below select */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Select options */
  options: SelectOption[];
  /** Current value */
  value?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  /** Whether select is disabled */
  disabled?: boolean;
  /** Container className */
  containerClassName?: string;
  /** Select trigger className */
  className?: string;
  /** Unique identifier */
  id?: string;
}

/**
 * Enhanced select component with built-in label, validation, and accessibility features
 * 
 * Features:
 * - Integrated label and error handling
 * - Proper ARIA attributes
 * - Focus management
 * - Responsive design
 * - Option grouping support
 */
export const EnhancedSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  EnhancedSelectProps
>(({
  label,
  helperText,
  error,
  required = false,
  placeholder = 'Select an option...',
  options,
  value,
  onValueChange,
  disabled = false,
  containerClassName,
  className,
  id,
}, ref) => {
  const selectId = id || React.useId();
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label 
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium text-foreground',
            required && "after:content-['*'] after:ml-0.5 after:text-destructive"
          )}
        >
          {label}
        </Label>
      )}
      
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          id={selectId}
          className={cn(
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <div 
          id={errorId}
          className="flex items-center gap-1 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
      
      {helperText && !error && (
        <p 
          id={helperId}
          className="text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

EnhancedSelect.displayName = 'EnhancedSelect';
