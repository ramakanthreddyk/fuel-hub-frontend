/**
 * @file components/error/index.ts
 * @description Error handling components exports
 */

// Error Boundary Components
export { ErrorBoundary, withErrorBoundary, useErrorHandler as useErrorReporter } from './ErrorBoundary';

// Error State Components
export {
  ErrorState,
  NetworkError,
  ServerError,
  NotFoundError,
  PermissionError,
  TimeoutError,
  GenericError,
  DataLoadError,
  RateLimitError,
  InlineError,
  ComponentErrorFallback,
} from './ErrorStates';

// Types
export type { ParsedError, ErrorContext, ErrorHandlerOptions } from '../../hooks/useErrorHandler';
