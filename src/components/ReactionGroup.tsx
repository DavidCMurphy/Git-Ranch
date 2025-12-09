import { graphql, useFragment, useMutation } from "react-relay";
import {
  ReactionGroup_group$key,
  ReactionContent,
} from "./__generated__/ReactionGroup_group.graphql";
import { getReactionEmoji } from "../lib/reactions";

type Props = {
  group: ReactionGroup_group$key;
};

const ReactionGroup = ({ group }: Props) => {
  const data = useFragment(
    graphql`
      fragment ReactionGroup_group on ReactionGroup {
        ...ReactionGroup_updatable
        content
        viewerHasReacted
        reactors {
          totalCount
        }
        subject {
          id
        }
      }
    `,
    group
  );

  const [commitRemove, isRemoveInFlight] = useMutation(graphql`
    mutation ReactionGroupRemoveReactionMutation($input: RemoveReactionInput!) {
      removeReaction(input: $input) {
        reaction {
          content
          reactable {
            ...ReactableReactions_reactable
          }
        }
      }
    }
  `);

  const handleRemoveReaction = (content: ReactionContent) => {
    commitRemove({
      variables: {
        input: {
          subjectId: data.subject.id,
          content: content,
        },
      },
      optimisticUpdater: (store) => {
        if (!data) return;
        const { updatableData } = store.readUpdatableFragment(
          graphql`
            fragment ReactionGroup_updatable on ReactionGroup @updatable {
              viewerHasReacted
              reactors {
                totalCount
              }
            }
          `,
          data
        );
        updatableData.viewerHasReacted = false;
        updatableData.reactors.totalCount--;
    });
  };

  if (data.reactors.totalCount === 0) {
    return null;
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (data.viewerHasReacted && !isRemoveInFlight) {
          handleRemoveReaction(data.content);
        }
      }}
      disabled={!data.viewerHasReacted || isRemoveInFlight}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-full transition-colors ${
        data.viewerHasReacted
          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer"
          : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-default"
      }`}
    >
      <span>{getReactionEmoji(data.content)}</span>
      <span>{data.reactors.totalCount}</span>
    </button>
  );
};

export default ReactionGroup;
