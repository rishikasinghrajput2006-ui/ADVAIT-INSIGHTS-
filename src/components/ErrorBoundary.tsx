import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Advait Insights Runtime Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center justify-center mx-auto text-sky-400 text-2xl font-bold">
              AI
            </div>
            <h2 className="text-xl font-bold font-heading">Advait Insights</h2>
            <p className="text-sm text-slate-300">
              The application encountered a brief display glitch. Click below to refresh your session seamlessly.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg cursor-pointer"
            >
              Reload Advait Insights
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
