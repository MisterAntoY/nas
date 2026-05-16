import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 24, color: '#c00', fontFamily: 'system-ui' }}>
            <strong>Algo correu mal.</strong>
            <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message}
            </pre>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
