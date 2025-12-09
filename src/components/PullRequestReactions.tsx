import { graphql, useFragment, useMutation } from "react-relay";
import {
  PullRequestReactions_reactions$key,
  ReactionContent,
} from "./__generated__/PullRequestReactions_reactions.graphql";

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

  const [commit, isInFlight] = useMutation(graphql`
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

  const handleRemoveReaction = (content: ReactionContent) => {
    commit({
      variables: {
        input: {
          subjectId: data.id,
          content: content,
        },
      },
    });
  };

  if (!data.reactionGroups || data.reactionGroups.length === 0) {
    return null;
  }

  const activeReactions = data.reactionGroups.filter(
    (group) => group.reactors.totalCount > 0
  );

  if (activeReactions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-3">
      {activeReactions.map((group) => (
        <button
          key={group.content}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (group.viewerHasReacted && !isInFlight) {
              handleRemoveReaction(group.content);
            }
          }}
          disabled={!group.viewerHasReacted || isInFlight}
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
    </div>
  );
};

export default PullRequestReactions;
