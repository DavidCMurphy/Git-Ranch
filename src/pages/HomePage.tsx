import { useLazyLoadQuery, graphql } from "react-relay";

import { initiateGitHubLogin } from "../lib/auth";
import { PullRequestList } from "../components/PullRequestList";
import { AuthorizedHeader } from "@/components/AuthorizedHeader";

import { HomePageQuery } from "./__generated__/HomePageQuery.graphql";

interface HomePageProps {
  onLogout: () => void;
}

export default function HomePage({ onLogout }: HomePageProps) {
  const data = useLazyLoadQuery<HomePageQuery>(
    graphql`
      query HomePageQuery {
        viewer {
          ...AuthorizedHeader_user
          ...PullRequestList_viewer
        }
      }
    `,
    {}
  );

  if (!data.viewer) {
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
        <AuthorizedHeader user={data.viewer} onLogout={onLogout} />
      </div>

      <PullRequestList viewer={data.viewer} />
    </div>
  );
}
