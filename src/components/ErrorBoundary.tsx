import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6">
          <div className="max-w-lg w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-2xl text-red-400">⚠️</span>
            </div>
            <h1 className="text-2xl font-light text-white mb-2">Something went wrong</h1>
            <p className="text-neutral-400 text-sm mb-6">
              The application failed to load. Please refresh the page or contact support if the issue persists.
            </p>
            {this.state.error && (
              <div className="text-left p-4 rounded-xl bg-neutral-900 border border-white/10 mb-6 overflow-auto">
                <p className="text-red-400 text-xs font-mono mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-neutral-500 text-xs font-mono whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-neutral-950 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
