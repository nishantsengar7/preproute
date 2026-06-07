import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional fallback UI. Receives the caught error. */
  fallback?: (error: Error | null) => React.ReactNode;
}

/**
 * Top-level Error Boundary — catches uncaught render errors and
 * displays a friendly fallback instead of a blank screen.
 *
 * Must be a class component because React only supports
 * `componentDidCatch` / `getDerivedStateFromError` on classes.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // In production this is where you'd send to Sentry / DataDog
    console.error('[ErrorBoundary] Uncaught render error:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center animate-fade-in-up">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 className="text-lg font-bold text-neutral-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page. If the issue
              persists, contact support.
            </p>

            {/* Error detail (collapsed in production) */}
            {this.state.error && (
              <details className="text-left mb-6 bg-neutral-50 rounded-lg border border-neutral-200 p-3">
                <summary className="text-xs font-semibold text-neutral-600 cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 text-[10px] text-red-700 overflow-auto max-h-32 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => { window.location.href = '/dashboard'; }}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
