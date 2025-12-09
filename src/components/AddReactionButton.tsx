import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { AddReactionButton_reactable$key } from "./__generated__/AddReactionButton_reactable.graphql";
import {
  REACTION_TYPES,
  getReactionEmoji,
  ReactionContent,
} from "../lib/reactions";

type Props = {
  reactable: AddReactionButton_reactable$key;
};

const AddReactionButton = ({ reactable }: Props) => {
  const data = useFragment(
    graphql`
      fragment AddReactionButton_reactable on Reactable {
        id
        reactionGroups {
          content
          ...AddReactionButton_updatable
        }
      }
    `,
    reactable
  );

  const [showPicker, setShowPicker] = useState(false);

  const [commitAdd, isAddInFlight] = useMutation(graphql`
    mutation AddReactionButtonAddReactionMutation($input: AddReactionInput!) {
      addReaction(input: $input) {
        reaction {
          content
          reactable {
            ...ReactableReactions_reactable
          }
        }
      }
    }
  `);

  const handleAddReaction = (content: ReactionContent) => {
    commitAdd({
      variables: {
        input: {
          subjectId: data.id,
          content: content,
        },
      },
      optimisticUpdater: (store) => {
        const reactionGroup = data.reactionGroups?.find(
          (group) => group?.content === content
        );
        if (!reactionGroup) return;

        const { updatableData } = store.readUpdatableFragment(
          graphql`
            fragment AddReactionButton_updatable on ReactionGroup @updatable {
              content
              viewerHasReacted
              reactors {
                totalCount
              }
            }
          `,
          reactionGroup
        );

        updatableData.viewerHasReacted = true;
        updatableData.reactors.totalCount++;
      },
      onCompleted: () => setShowPicker(false),
    });
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPicker(!showPicker);
        }}
        className="inline-flex items-center justify-center w-6 h-6 text-xs border border-zinc-200 dark:border-zinc-700 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        +
      </button>

      {showPicker && (
        <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg flex gap-1 z-10">
          {REACTION_TYPES.map((type) => (
            <button
              key={type}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddReaction(type);
              }}
              disabled={isAddInFlight}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            >
              {getReactionEmoji(type)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddReactionButton;
