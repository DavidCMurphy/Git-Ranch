import { Component, ReactNode } from "react";

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode);
}

interface State {
  hasError: boolean;
  error?: Error;
}

// 🌵 Default fallback - the cowboy-themed error display
const DefaultErrorFallback = ({ error, resetError }: ErrorFallbackProps) => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
    <div className="max-w-md p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg">
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
        🌵 Well, Shucks!
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
        {error?.message ||
          "A tumbleweed done blown through and spooked the horses"}
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
      >
        🤠 Git Back in the Saddle
      </button>
    </div>
  </div>
);

// 🌿 ErrorBoundary - Catches errors like a tumbleweed catches the wind
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      // If fallback is null, render nothing
      if (fallback === null) {
        return null;
      }

      // If fallback is a function, call it with error props
      if (typeof fallback === "function") {
        return fallback({
          error: this.state.error,
          resetError: this.resetError,
        });
      }

      // If fallback is a ReactNode, render it
      if (fallback !== undefined) {
        return fallback;
      }

      // Default fallback
      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
