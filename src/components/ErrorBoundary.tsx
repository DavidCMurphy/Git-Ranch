import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasTumbleweed: boolean;
  error?: Error;
  showRollingTumbleweed: boolean;
}

// 🌿 A tumbleweed that randomly rolls across the screen
const RollingTumbleweed = () => (
  <div
    className="fixed pointer-events-none z-50 animate-tumbleweed"
    style={{
      top: `${Math.random() * 60 + 20}%`,
    }}
  >
    <img
      src="/desert-tumbleweed-landscape-on-transparent-background-png.png"
      alt="Tumbleweed"
      className="animate-spin-slow w-60 h-60 object-contain"
    />
  </div>
);

// 🌿 ErrorBoundary - Catches errors like a tumbleweed catches the wind
export class ErrorBoundary extends Component<Props, State> {
  private tumbleweedInterval: ReturnType<typeof setInterval> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasTumbleweed: false, showRollingTumbleweed: false };
  }

  componentDidMount() {
    // Random tumbleweed every 30-90 seconds
    this.scheduleTumbleweed();
  }

  componentWillUnmount() {
    if (this.tumbleweedInterval) {
      clearTimeout(this.tumbleweedInterval);
    }
  }

  scheduleTumbleweed = () => {
    const randomDelay = Math.random() * 60000 + 30000; // 30-90 seconds
    this.tumbleweedInterval = setTimeout(() => {
      this.setState({ showRollingTumbleweed: true });
      // Hide after animation completes (5 seconds)
      setTimeout(() => {
        this.setState({ showRollingTumbleweed: false });
        this.scheduleTumbleweed();
      }, 5000);
    }, randomDelay);
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasTumbleweed: true, error };
  }

  render() {
    if (this.state.hasTumbleweed) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="max-w-md p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              🌵 Well, Shucks!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {this.state.error?.message ||
                "A tumbleweed done blown through and spooked the horses"}
            </p>
            <button
              onClick={() => this.setState({ hasTumbleweed: false })}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              🤠 Git Back in the Saddle
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {this.state.showRollingTumbleweed && <RollingTumbleweed />}
        {this.props.children}
      </>
    );
  }
}
