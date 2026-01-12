import React from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => (
  <div className={styles.errorBoundary}>
    <div className={styles.errorContent}>
      <h3 className={styles.errorTitle}>Something went wrong</h3>
      <p className={styles.errorMessage}>
        We encountered an error while loading this content. This might be due to a temporary issue.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className={styles.errorDetails}>
          <summary>Error Details (Development)</summary>
          <pre className={styles.errorStack}>{error.stack}</pre>
        </details>
      )}
      {retry && (
        <button onClick={retry} className={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Content-specific error boundary for database content loading
export const ContentErrorBoundary: React.FC<{
  children: React.ReactNode;
  contentType: string;
}> = ({ children, contentType }) => (
  <ErrorBoundary
    fallback={({ error, retry }) => (
      <div className={styles.contentError}>
        <div className={styles.contentErrorContent}>
          <p className={styles.contentErrorMessage}>
            Content not available: {contentType}. Please check database configuration.
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className={styles.contentErrorDetails}>
              <summary>Debug Info</summary>
              <small>{error.message}</small>
            </details>
          )}
          {retry && (
            <button onClick={retry} className={styles.contentRetryButton}>
              Retry Load
            </button>
          )}
        </div>
      </div>
    )}
    onError={(error) => {
      console.error(`Content loading failed for ${contentType}:`, error);
    }}
  >
    {children}
  </ErrorBoundary>
);

// Hook for using error boundary in functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by error handler:', error, errorInfo);
    // You could send this to an error reporting service
  };
};