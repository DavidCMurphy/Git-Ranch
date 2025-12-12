import { graphql, useFragment } from "react-relay";
import type { BranchInfo_pullRequest$key } from "./__generated__/BranchInfo_pullRequest.graphql";

type BranchInfoProps = {
  pullRequest: BranchInfo_pullRequest$key;
};

// 🌿 BranchInfo - Shows which trails this cattle's takin'
export const BranchInfo = ({ pullRequest }: BranchInfoProps) => {
  const data = useFragment(
    graphql`
      fragment BranchInfo_pullRequest on PullRequest {
        headRefName
        baseRefName
      }
    `,
    pullRequest
  );

  return (
    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
      <div className="flex items-center gap-1">
        <span className="font-mono">{data.headRefName}</span>
        <span>→</span>
        <span className="font-mono">{data.baseRefName}</span>
      </div>
    </div>
  );
};
