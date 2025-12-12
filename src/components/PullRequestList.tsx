import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import type { PullRequestListQuery as PullRequestListQueryType } from "./__generated__/PullRequestListQuery.graphql";
import type { PullRequestList_viewer$key } from "./__generated__/PullRequestList_viewer.graphql";
import { PullRequestCard } from "./PullRequestCard";
import { PullRequestErrorBoundary } from "./PullRequestErrorBoundary";

// 🐄 PullRequestList - Round up them cattle (PRs) from the range
export const PullRequestList = ({ headCount = 10 }: { headCount?: number }) => {
  const queryData = useLazyLoadQuery<PullRequestListQueryType>(
    graphql`
      query PullRequestListQuery($first: Int!) {
        viewer {
          ...PullRequestList_viewer @arguments(first: $first)
        }
      }
    `,
    { first: headCount }
  );

  return <PullRequestListContent viewer={queryData.viewer} />;
};

type PullRequestListContentProps = {
  viewer: PullRequestList_viewer$key;
};

const PullRequestListContent = ({ viewer }: PullRequestListContentProps) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment PullRequestList_viewer on User
      @refetchable(queryName: "PullRequestListPaginationQuery")
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
      ) {
        login
        pullRequests(
          first: $first
          after: $after
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) @connection(key: "PullRequestList_pullRequests") {
          totalCount
          edges {
            node {
              id
              ...PullRequestCard_pullRequest
            }
          }
        }
      }
    `,
    viewer
  );

  const roundups =
    data.pullRequests.edges?.filter(
      (edge): edge is NonNullable<typeof edge> =>
        edge !== null && edge?.node !== null
    ) ?? [];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🐄 {data.login}'s Cattle Roundup
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {data.pullRequests.totalCount} head of cattle need wranglin'
        </p>
      </div>

      {roundups.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          🌵 No cattle on the range, partner. The herd's all accounted for!
        </div>
      ) : (
        <div className="grid gap-4">
          {roundups.map(
            (edge) =>
              edge.node && (
                <PullRequestErrorBoundary key={edge.node.id}>
                  <PullRequestCard pullRequest={edge.node} />
                </PullRequestErrorBoundary>
              )
          )}
        </div>
      )}

      {hasNext && (
        <div className="mt-6 text-center">
          <button
            onClick={() => loadNext(10)}
            disabled={isLoadingNext}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoadingNext
              ? "🐄 Roundin' up more cattle..."
              : "🤠 Load More Cattle"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PullRequestList;
