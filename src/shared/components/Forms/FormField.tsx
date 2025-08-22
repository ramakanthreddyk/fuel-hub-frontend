/**
 * @file shared/components/Forms/FormField.tsx
 * @description Reusable form field wrapper with validation
 */

import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
  hint,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

// Input component with validation styling
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
  const errorClasses = error 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
    : "";

  return (
    <input
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

// Textarea component with validation styling
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
  const errorClasses = error 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
    : "";

  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

// Select component with validation styling
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  error = false,
  className = '',
  placeholder,
  children,
  ...props
}) => {
  const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
  const errorClasses = error 
    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
    : "";

  return (
    <select
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {label && (
        <label className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
};

// Usage examples:
/*
// Basic form field with input
<FormField label="Station Name" required error={errors.name}>
  <Input 
    value={formData.name}
    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
    error={!!errors.name}
    placeholder="Enter station name"
  />
</FormField>

// Select field
<FormField label="Status" error={errors.status}>
  <Select 
    value={formData.status}
    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
    error={!!errors.status}
    placeholder="Select status"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </Select>
</FormField>

// Textarea field
<FormField 
  label="Description" 
  hint="Provide additional details about the station"
  error={errors.description}
>
  <Textarea 
    value={formData.description}
    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
    error={!!errors.description}
    rows={4}
  />
</FormField>

// Checkbox
<Checkbox 
  label="Send notifications"
  checked={formData.notifications}
  onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
/>
*/
