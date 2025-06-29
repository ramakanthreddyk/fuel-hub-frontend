
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface EnhancedInputProps extends Omit<InputProps, 'type'> {
  /** Input label */
  label?: string;
  /** Help text displayed below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Input type with enhanced options */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Icon to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right */
  rightIcon?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
}

/**
 * Enhanced input component with built-in label, validation, and accessibility features
 * 
 * Features:
 * - Integrated label and error handling
 * - Password visibility toggle
 * - Icon support
 * - Proper ARIA attributes
 * - Focus management
 * - Responsive design
 */
export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    label,
    helperText,
    error,
    required = false,
    type = 'text',
    leftIcon,
    rightIcon,
    containerClassName,
    className,
    id,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label 
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-foreground',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            required={required}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
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
  }
);

EnhancedInput.displayName = 'EnhancedInput';
