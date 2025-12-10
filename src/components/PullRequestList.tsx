import { graphql, useLazyLoadQuery } from "react-relay";
import { type PullRequestListQuery } from "./__generated__/PullRequestListQuery.graphql";
import PullRequest from "./PullRequest";
import { PullRequestErrorBoundary } from "./PullRequestErrorBoundary";

const PullRequestListQuery = graphql`
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
          ...PullRequest_pr
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
    PullRequestListQuery["response"]["viewer"]["pullRequests"]["nodes"]
  >[number]
>;

export default function PullRequestList({ count = 20 }: PullRequestListProps) {
  const data = useLazyLoadQuery<PullRequestListQuery>(PullRequestListQuery, {
    first: count,
  });

  const { viewer } = data;
  const pullRequests = (viewer.pullRequests.nodes?.filter(
    (pr): pr is PullRequest => pr !== null && pr !== undefined
  ) ?? []) as PullRequest[];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {viewer.login}'s Open Pull Requests
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {viewer.pullRequests.totalCount} open pull request
          {viewer.pullRequests.totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {pullRequests.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          No open pull requests found
        </div>
      ) : (
        <div className="grid gap-4">
          {pullRequests.map((pr, index) => (
            <PullRequestErrorBoundary key={index}>
              <PullRequest pr={pr} />
            </PullRequestErrorBoundary>
          ))}
        </div>
      )}
    </div>
  );
}
