import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(err: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', err, errorInfo);
    this.setState({
      error: err,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-jarvis-bg-dark flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-jarvis-bg-card border border-jarvis-orange/30 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-jarvis-orange/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-jarvis-orange" />
              </div>
              <div>
                <h1 className="text-2xl font-display text-jarvis-orange">
                  Oops! Something went wrong
                </h1>
                <p className="text-sm text-jarvis-text-muted mt-1">
                  An unexpected error occurred in the application
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6">
                <h2 className="text-sm font-body font-semibold text-jarvis-text-secondary mb-2">
                  Error Details:
                </h2>
                <div className="bg-jarvis-bg-dark border border-jarvis-cyan/20 rounded p-4 font-mono text-xs text-jarvis-text-muted overflow-x-auto">
                  <p className="text-jarvis-orange mb-2">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="whitespace-pre-wrap text-jarvis-text-muted">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {this.state.errorInfo && (
              <details className="mb-6">
                <summary className="text-sm font-body font-semibold text-jarvis-text-secondary cursor-pointer hover:text-jarvis-cyan mb-2">
                  Component Stack
                </summary>
                <div className="bg-jarvis-bg-dark border border-jarvis-cyan/20 rounded p-4 font-mono text-xs text-jarvis-text-muted overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-jarvis-cyan text-jarvis-bg-dark rounded-lg font-body font-medium hover:bg-jarvis-cyan/80 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-jarvis-bg-dark border border-jarvis-cyan/20 text-jarvis-text-secondary rounded-lg font-body font-medium hover:bg-jarvis-bg-card hover:text-jarvis-text-primary transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
