/**
 * @file components/accessibility/AccessibleComponents.tsx
 * @description Accessible wrapper components with built-in ARIA support
 */
import React, { useRef, useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className = '',
  ...props
}) => {
  const { announceToScreenReader } = useAccessibility();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    
    if (props.onClick) {
      props.onClick(event);
    }
  };

  useEffect(() => {
    if (loading) {
      announceToScreenReader(loadingText);
    }
  }, [loading, loadingText, announceToScreenReader]);

  return (
    <button
      {...props}
      className={`accessible-button ${variant} ${size} ${className}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-describedby={loading ? `${props.id}-loading` : undefined}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <span aria-hidden="true" className="loading-spinner" />
          <span id={`${props.id}-loading`} className="sr-only">
            {loadingText}
          </span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Accessible Form Field Component
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactElement;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  id,
  error,
  hint,
  required = false,
  children,
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ');

  const childWithProps = React.cloneElement(children, {
    id,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': describedBy || undefined,
  });

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="required-indicator" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}
      
      {childWithProps}
      
      {error && (
        <p id={errorId} className="form-error" role="alert" aria-live="polite">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible Modal Component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Announce modal opening
      announceToScreenReader(`${title} dialog opened`);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announceToScreenReader]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-content ${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            data-close-modal
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Accessible Table Component
interface AccessibleTableProps {
  caption: string;
  headers: string[];
  data: Array<Record<string, any>>;
  sortable?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  caption,
  headers,
  data,
  sortable = false,
  onSort,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { announceToScreenReader } = useAccessibility();

  const handleSort = (column: string) => {
    if (!sortable || !onSort) return;

    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort(column, newDirection);
    
    announceToScreenReader(
      `Table sorted by ${column} in ${newDirection}ending order`
    );
  };

  return (
    <div className="table-container" role="region" aria-labelledby="table-caption">
      <table className="accessible-table" role="table">
        <caption id="table-caption" className="table-caption">
          {caption}
        </caption>
        
        <thead>
          <tr role="row">
            {headers.map((header, index) => (
              <th
                key={index}
                role="columnheader"
                scope="col"
                className={sortable ? 'sortable' : ''}
                aria-sort={
                  sortColumn === header
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                onClick={() => handleSort(header)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && sortable) {
                    e.preventDefault();
                    handleSort(header);
                  }
                }}
                tabIndex={sortable ? 0 : -1}
              >
                {header}
                {sortable && (
                  <span className="sort-indicator" aria-hidden="true">
                    {sortColumn === header
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} role="row">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} role="gridcell">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Accessible Alert Component
interface AccessibleAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoFocus?: boolean;
}

export const AccessibleAlert: React.FC<AccessibleAlertProps> = ({
  type,
  title,
  children,
  dismissible = false,
  onDismiss,
  autoFocus = false,
}) => {
  const alertRef = useRef<HTMLDivElement>(null);
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    if (autoFocus && alertRef.current) {
      alertRef.current.focus();
    }
    
    // Announce alert to screen readers
    const message = title ? `${title}: ${children}` : children;
    announceToScreenReader(String(message), type === 'error' ? 'assertive' : 'polite');
  }, [autoFocus, title, children, type, announceToScreenReader]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div
      ref={alertRef}
      className={`alert alert-${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      tabIndex={autoFocus ? -1 : undefined}
    >
      <div className="alert-content">
        <span className="alert-icon" aria-hidden="true">
          {getIcon()}
        </span>
        
        <div className="alert-text">
          {title && (
            <div className="alert-title" role="heading" aria-level={3}>
              {title}
            </div>
          )}
          <div className="alert-message">
            {children}
          </div>
        </div>
        
        {dismissible && onDismiss && (
          <button
            className="alert-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Accessible Progress Component
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
}) => {
  const percentage = Math.round((value / max) * 100);
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    // Announce progress updates
    if (percentage === 100) {
      announceToScreenReader(`${label} completed`);
    } else if (percentage % 25 === 0) {
      announceToScreenReader(`${label} ${percentage}% complete`);
    }
  }, [percentage, label, announceToScreenReader]);

  return (
    <div className={`progress-container ${size}`}>
      <div className="progress-label">
        <span>{label}</span>
        {showPercentage && (
          <span className="progress-percentage" aria-live="polite">
            {percentage}%
          </span>
        )}
      </div>
      
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label} ${percentage}% complete`}
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
