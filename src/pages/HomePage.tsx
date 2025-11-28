import { initiateGitHubLogin, type GitHubUser } from '../lib/auth';
import PullRequestList from '../components/PullRequestList';

interface HomePageProps {
  user: GitHubUser | null;
  onLogout: () => void;
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            GitHub Pull Request Viewer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Sign in with GitHub to view your open pull requests
          </p>
          <button
            onClick={initiateGitHubLogin}
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome, {user.name || user.login}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <PullRequestList />
    </div>
  );
}

