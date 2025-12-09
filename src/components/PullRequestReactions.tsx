import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import {
  PullRequestReactions_reactions$key,
  ReactionContent,
} from "./__generated__/PullRequestReactions_reactions.graphql";

const REACTION_TYPES: ReactionContent[] = [
  "THUMBS_UP",
  "THUMBS_DOWN",
  "LAUGH",
  "HOORAY",
  "CONFUSED",
  "HEART",
  "ROCKET",
  "EYES",
];

const getReactionEmoji = (content: ReactionContent): string => {
  switch (content) {
    case "CONFUSED":
      return "😕";
    case "EYES":
      return "👀";
    case "HEART":
      return "❤️";
    case "HOORAY":
      return "🎉";
    case "LAUGH":
      return "😄";
    case "ROCKET":
      return "🚀";
    case "THUMBS_DOWN":
      return "👎";
    case "THUMBS_UP":
      return "👍";
    default:
      throw new Error(`Unknown reaction content: ${content}`);
  }
};

type Props = {
  reactions: PullRequestReactions_reactions$key;
};

const PullRequestReactions = ({ reactions }: Props) => {
  const data = useFragment(
    graphql`
      fragment PullRequestReactions_reactions on PullRequest {
        id
        reactionGroups {
          content
          viewerHasReacted
          reactors {
            totalCount
          }
        }
      }
    `,
    reactions
  );

  const [showPicker, setShowPicker] = useState(false);

  const [commitRemove, isRemoveInFlight] = useMutation(graphql`
    mutation PullRequestReactionsRemoveReactionMutation(
      $input: RemoveReactionInput!
    ) {
      removeReaction(input: $input) {
        reaction {
          content
          reactable {
            ...PullRequestReactions_reactions
          }
        }
      }
    }
  `);

  const [commitAdd, isAddInFlight] = useMutation(graphql`
    mutation PullRequestReactionsAddReactionMutation(
      $input: AddReactionInput!
    ) {
      addReaction(input: $input) {
        reaction {
          content
          reactable {
            ...PullRequestReactions_reactions
          }
        }
      }
    }
  `);

  const handleRemoveReaction = (content: ReactionContent) => {
    commitRemove({
      variables: {
        input: {
          subjectId: data.id,
          content: content,
        },
      },
    });
  };

  const handleAddReaction = (content: ReactionContent) => {
    commitAdd({
      variables: {
        input: {
          subjectId: data.id,
          content: content,
        },
      },
      onCompleted: () => setShowPicker(false),
    });
  };

  if (!data.reactionGroups) {
    return null;
  }

  const activeReactions = data.reactionGroups.filter(
    (group) => group.reactors.totalCount > 0
  );

  return (
    <div className="flex gap-2 mb-3 items-center relative">
      {activeReactions.map((group) => (
        <button
          key={group.content}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (group.viewerHasReacted && !isRemoveInFlight) {
              handleRemoveReaction(group.content);
            }
          }}
          disabled={!group.viewerHasReacted || isRemoveInFlight}
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-full transition-colors ${
            group.viewerHasReacted
              ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer"
              : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-default"
          }`}
        >
          <span>{getReactionEmoji(group.content)}</span>
          <span>{group.reactors.totalCount}</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPicker(!showPicker);
          }}
          className="inline-flex items-center justify-center w-6 h-6 text-xs border border-zinc-200 dark:border-zinc-700 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
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
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
              >
                {getReactionEmoji(type)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestReactions;
