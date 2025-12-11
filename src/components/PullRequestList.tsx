import { graphql, useLazyLoadQuery } from "react-relay";
import type { PullRequestListQuery as PullRequestListQueryType } from "./__generated__/PullRequestListQuery.graphql";

type Roundup = NonNullable<
  NonNullable<
    PullRequestListQueryType["response"]["viewer"]["pullRequests"]["nodes"]
  >[number]
>;

// 🐄 PullRequestList - Round up them cattle (PRs) from the range
export const PullRequestList = ({ headCount = 20 }: { headCount?: number }) => {
  const data = useLazyLoadQuery<PullRequestListQueryType>(
    graphql`
      query PullRequestListQuery($first: Int!) {
        viewer {
          login
          pullRequests(
            first: $first
            states: [OPEN]
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
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
    `,
    { first: headCount }
  );

  const { viewer } = data;
  const roundups = (viewer.pullRequests.nodes?.filter(
    (pr): pr is Roundup => pr !== null && pr !== undefined
  ) ?? []) as Roundup[];

  const getBrandingBadge = (decision: string | null | undefined) => {
    if (!decision) return null;

    const brands = {
      APPROVED: {
        text: "🏷️ Branded & Ready",
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      },
      CHANGES_REQUESTED: {
        text: "🔧 Needs Re-shoein'",
        color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      },
      REVIEW_REQUIRED: {
        text: "👀 Needs Inspectin'",
        color:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      },
    };

    const brand = brands[decision as keyof typeof brands];
    if (!brand) return null;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${brand.color}`}>
        {brand.text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🐄 {viewer.login}'s Cattle Roundup
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {viewer.pullRequests.totalCount} head of cattle need wranglin'
          {viewer.pullRequests.totalCount !== 1 ? "" : ""}
        </p>
      </div>

      {roundups.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          🌵 No cattle on the range, partner. The herd's all accounted for!
        </div>
      ) : (
        <div className="grid gap-4">
          {roundups.map((cattle) => (
            <a
              key={cattle.id}
              href={cattle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">
                      🐮 #{cattle.number}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-600">•</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {cattle.repository.nameWithOwner}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {cattle.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {cattle.isDraft && (
                    <span className="px-2 py-1 text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                      📝 Still Ropin'
                    </span>
                  )}
                  {getBrandingBadge(cattle.reviewDecision)}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-mono">{cattle.headRefName}</span>
                  <span>→</span>
                  <span className="font-mono">{cattle.baseRefName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 dark:text-green-400">
                    +{cattle.additions}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    -{cattle.deletions}
                  </span>
                </div>
                <div>
                  🌅 Started {new Date(cattle.createdAt).toLocaleDateString()}
                </div>
                <div>
                  🔄 Last wrangled{" "}
                  {new Date(cattle.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default PullRequestList;
