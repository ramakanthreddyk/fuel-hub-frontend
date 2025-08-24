/**
 * @file components/ui/SafeHtml.tsx
 * @description Safe HTML rendering component to prevent XSS attacks
 */

import React from 'react';
import { sanitizeHtml, CSP } from '@/utils/security';

interface SafeHtmlProps {
  html: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  allowedTags?: string[];
  stripTags?: boolean;
}

/**
 * SafeHtml component that sanitizes HTML content before rendering
 * Use this instead of dangerouslySetInnerHTML
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  tag: Tag = 'div',
  className,
  stripTags = false,
  ...props
}) => {
  const sanitizedContent = React.useMemo(() => {
    if (!html) return '';
    
    if (stripTags) {
      // Strip all HTML tags and return plain text
      return html.replace(/<[^>]*>/g, '');
    }
    
    // Check if content is safe
    if (!CSP.isSafeContent(html)) {
      console.warn('Potentially unsafe HTML content detected and sanitized');
      return sanitizeHtml(html);
    }
    
    return sanitizeHtml(html);
  }, [html, stripTags]);

  return (
    <Tag 
      className={className} 
      {...props}
    >
      {sanitizedContent}
    </Tag>
  );
};

interface SafeTextProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  maxLength?: number;
}

/**
 * SafeText component for displaying user-generated text content
 */
export const SafeText: React.FC<SafeTextProps> = ({
  text,
  tag: Tag = 'span',
  className,
  maxLength,
  ...props
}) => {
  const sanitizedText = React.useMemo(() => {
    if (typeof text !== 'string') {
      // If text is a number, convert to string; if object, use JSON.stringify or empty string
      if (typeof text === 'number') return String(text);
      if (typeof text === 'object' && text !== null) return JSON.stringify(text);
      return '';
    }
    let sanitized = sanitizeHtml(text);
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.slice(0, maxLength) + '...';
    }
    return sanitized;
  }, [text, maxLength]);

  return (
    <Tag className={className} {...props}>
      {sanitizedText}
    </Tag>
  );
};

interface SafeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean;
  maxLength?: number;
}

/**
 * SafeInput component that sanitizes input values
 */
export const SafeInput: React.FC<SafeInputProps> = ({
  sanitize = true,
  onChange,
  maxLength = 1000,
  ...props
}) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (sanitize) {
      const sanitizedValue = sanitizeHtml(e.target.value);
      if (sanitizedValue !== e.target.value) {
        e.target.value = sanitizedValue;
      }
    }
    
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    
    onChange?.(e);
  }, [sanitize, maxLength, onChange]);

  return (
    <input
      {...props}
      maxLength={maxLength}
      onChange={handleChange}
    />
  );
};

interface SafeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  sanitize?: boolean;
  maxLength?: number;
}

/**
 * SafeTextarea component that sanitizes textarea values
 */
export const SafeTextarea: React.FC<SafeTextareaProps> = ({
  sanitize = true,
  onChange,
  maxLength = 5000,
  ...props
}) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (sanitize) {
      const sanitizedValue = sanitizeHtml(e.target.value);
      if (sanitizedValue !== e.target.value) {
        e.target.value = sanitizedValue;
      }
    }
    
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    
    onChange?.(e);
  }, [sanitize, maxLength, onChange]);

  return (
    <textarea
      {...props}
      maxLength={maxLength}
      onChange={handleChange}
    />
  );
};

/**
 * Hook for safely handling user input
 */
export const useSafeInput = (initialValue: string = '') => {
  const [value, setValue] = React.useState(() => sanitizeHtml(initialValue));
  
  const setSafeValue = React.useCallback((newValue: string) => {
    setValue(sanitizeHtml(newValue));
  }, []);
  
  const handleChange = React.useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSafeValue(e.target.value);
  }, [setSafeValue]);
  
  return {
    value,
    setValue: setSafeValue,
    onChange: handleChange,
  };
};

/**
 * Higher-order component to wrap components with XSS protection
 */
export function withXSSProtection<P extends object>(
  Component: React.ComponentType<P>
) {
  return React.forwardRef<any, P>((props, ref) => {
    // Sanitize all string props
    const sanitizedProps = React.useMemo(() => {
      const sanitized = { ...props };
      
      Object.keys(sanitized).forEach(key => {
        const value = (sanitized as any)[key];
        if (typeof value === 'string') {
          (sanitized as any)[key] = sanitizeHtml(value);
        }
      });
      
      return sanitized;
    }, [props]);
    
    return <Component ref={ref} {...sanitizedProps} />;
  });
}