import { graphql, useFragment } from "react-relay";
import type { Wranglers_assignable$key } from "./__generated__/Wranglers_assignable.graphql";

type WranglersProps = {
  cattle: Wranglers_assignable$key;
};

// 🤠 Wranglers - Show who's wranglin' this here cattle
export const Wranglers = ({ cattle }: WranglersProps) => {
  const data = useFragment(
    graphql`
      fragment Wranglers_assignable on Assignable @throwOnFieldError {
        assignees(first: 5) @connection(key: "Wranglers_assignees") {
          edges {
            node {
              name
              avatarUrl(size: 32)
            }
          }
        }
      }
    `,
    cattle
  );

  const assignees =
    data.assignees.edges?.filter(
      (edge): edge is NonNullable<typeof edge> =>
        edge !== null && edge.node !== null
    ) ?? [];

  if (assignees.length === 0) {
    return null;
  }

  return (
    <div className="ml-auto flex flex-col items-end gap-1">
      <span className="text-xs text-zinc-500">🤠 Wranglers</span>
      <div className="flex items-center gap-2">
        {assignees.map(
          (edge) =>
            edge.node && (
              <div key={edge.node.name} className="flex items-center gap-1">
                <img
                  src={edge.node.avatarUrl}
                  alt={edge.node.name ?? undefined}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900"
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {edge.node.name}
                </span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Wranglers;
