import { graphql, useFragment } from "react-relay";
import { PullRequest_pr$key } from "./__generated__/PullRequest_pr.graphql";

const PullRequest = ({ pr }: { pr: PullRequest_pr$key }) => {
  const data = useFragment(
    graphql`
      fragment PullRequest_pr on PullRequest {
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
    `,
    pr
  );

  const getReviewDecisionBadge = (decision: string | null | undefined) => {
    if (!decision) return null;

    const badges = {
      APPROVED: {
        text: "Approved",
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      },
      CHANGES_REQUESTED: {
        text: "Changes Requested",
        color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      },
      REVIEW_REQUIRED: {
        text: "Review Required",
        color:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      },
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
    <a
      key={data.id}
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">
              #{data.number}
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
              Draft
            </span>
          )}
          {getReviewDecisionBadge(data.reviewDecision)}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        <div className="flex items-center gap-1">
          <span className="font-mono">{data.headRefName}</span>
          <span>→</span>
          <span className="font-mono">{data.baseRefName}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="text-green-600 dark:text-green-400">
            +{data.additions}
          </span>
          <span className="text-red-600 dark:text-red-400">
            -{data.deletions}
          </span>
        </div>
        <div>Created {new Date(data.createdAt).toLocaleDateString()}</div>
        <div>Updated {new Date(data.updatedAt).toLocaleDateString()}</div>
      </div>
    </a>
  );
};

export default PullRequest;
