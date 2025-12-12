import { graphql, useFragment } from "react-relay";
import type { PullRequestCard_pullRequest$key } from "./__generated__/PullRequestCard_pullRequest.graphql";
import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { BranchInfo } from "./BranchInfo";
import { DiffStats } from "./DiffStats";
import { Wranglers } from "./Wranglers";
import ReactableReactions from "./ReactableReactions";
import { ErrorBoundary } from "./ErrorBoundary";

type PullRequestCardProps = {
  pullRequest: PullRequestCard_pullRequest$key;
};

// 🐮 PullRequestCard - One head of cattle on the range
export const PullRequestCard = ({ pullRequest }: PullRequestCardProps) => {
  const data = useFragment(
    graphql`
      fragment PullRequestCard_pullRequest on PullRequest @throwOnFieldError {
        id
        number
        title
        url
        isDraft
        reviewDecision
        repository {
          nameWithOwner
        }
        author {
          ... on User {
            id
            name
          }
        }
        ...BranchInfo_pullRequest
        ...DiffStats_pullRequest
        ...Wranglers_assignable
        ...ReactableReactions_reactable
      }
    `,
    pullRequest
  );

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">
              🐮 #{data.number}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {data.repository.nameWithOwner}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {data.title}
          </h2>
        </div>
        <div className="flex gap-2">
          {data.isDraft && (
            <span className="px-2 py-1 text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
              📝 Still Ropin'
            </span>
          )}
          <ReviewStatusBadge decision={data.reviewDecision} />
        </div>
      </div>

      <BranchInfo pullRequest={data} />
      <ReactableReactions reactable={data} />
      <div className="flex items-center justify-between">
        <DiffStats pullRequest={data} />
        <ErrorBoundary fallback={null}>
          <Wranglers cattle={data} />
        </ErrorBoundary>
      </div>
    </a>
  );
};
