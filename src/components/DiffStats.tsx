import { graphql, useFragment } from "react-relay";
import type { DiffStats_pullRequest$key } from "./__generated__/DiffStats_pullRequest.graphql";

type DiffStatsProps = {
  pullRequest: DiffStats_pullRequest$key;
};

// 📊 DiffStats - Count the head of cattle bein' moved
export const DiffStats = ({ pullRequest }: DiffStatsProps) => {
  const data = useFragment(
    graphql`
      fragment DiffStats_pullRequest on PullRequest {
        additions
        deletions
        createdAt
        updatedAt
      }
    `,
    pullRequest
  );

  return (
    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500 gap-4">
      <div className="flex items-center gap-1">
        <span className="text-green-600 dark:text-green-400">
          +{data.additions}
        </span>
        <span className="text-red-600 dark:text-red-400">
          -{data.deletions}
        </span>
      </div>
      <div>🌅 Started {new Date(data.createdAt).toLocaleDateString()}</div>
      <div>
        🔄 Last wrangled {new Date(data.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};
