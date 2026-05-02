import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-100">
          <h2 className="text-slate-900 font-bold mb-2">Something went wrong.</h2>
          <p className="text-slate-500 text-sm">We're having trouble loading this section.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
