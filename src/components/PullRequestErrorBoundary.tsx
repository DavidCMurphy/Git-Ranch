import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  prNumber?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PullRequestErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("PullRequest render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="block p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
                Failed to load pull request
                {this.props.prNumber && ` #${this.props.prNumber}`}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

