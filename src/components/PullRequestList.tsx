import { graphql, useLazyLoadQuery } from "react-relay";
import type { PullRequestListQuery as PullRequestListQueryType } from "@/__generated__/PullRequestListQuery.graphql";

const PullRequestListQuery = graphql`
  query PullRequestListQuery($first: Int!) {
    viewer {
      login
      pullRequests(first: $first, states: [OPEN], orderBy: { field: UPDATED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          number
          title
          url
          state
          isDraft
          createdAt
          updatedAt
          repository {
            name
            nameWithOwner
          }
          baseRefName
          headRefName
          additions
          deletions
          reviewDecision
        }
      }
    }
  }
`;

interface PullRequestListProps {
  count?: number;
}

type PullRequest = NonNullable<
  NonNullable<
    PullRequestListQueryType["response"]["viewer"]["pullRequests"]["nodes"]
  >[number]
>;

export default function PullRequestList({ count = 20 }: PullRequestListProps) {
  const data = useLazyLoadQuery<PullRequestListQueryType>(PullRequestListQuery, {
    first: count,
  });

  const { viewer } = data;
  const pullRequests = (viewer.pullRequests.nodes?.filter(
    (pr): pr is PullRequest => pr !== null && pr !== undefined
  ) ?? []) as PullRequest[];

  const getReviewDecisionBadge = (decision: string | null | undefined) => {
    if (!decision) return null;

    const badges = {
      APPROVED: { text: "Approved", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
      CHANGES_REQUESTED: { text: "Changes Requested", color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" },
      REVIEW_REQUIRED: { text: "Review Required", color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" },
    };

    const badge = badges[decision as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {viewer.login}'s Open Pull Requests
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {viewer.pullRequests.totalCount} open pull request{viewer.pullRequests.totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {pullRequests.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          No open pull requests found
        </div>
      ) : (
        <div className="grid gap-4">
          {pullRequests.map((pr) => (
            <a
              key={pr.id}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">
                      #{pr.number}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-600">•</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {pr.repository.nameWithOwner}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {pr.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {pr.isDraft && (
                    <span className="px-2 py-1 text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                      Draft
                    </span>
                  )}
                  {getReviewDecisionBadge(pr.reviewDecision)}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-mono">{pr.headRefName}</span>
                  <span>→</span>
                  <span className="font-mono">{pr.baseRefName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 dark:text-green-400">+{pr.additions}</span>
                  <span className="text-red-600 dark:text-red-400">-{pr.deletions}</span>
                </div>
                <div>
                  Created {new Date(pr.createdAt).toLocaleDateString()}
                </div>
                <div>
                  Updated {new Date(pr.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

