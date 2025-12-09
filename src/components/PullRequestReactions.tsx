import { graphql, useFragment } from "react-relay";
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
        reactionGroups {
          content
          reactors {
            totalCount
          }
        }
      }
    `,
    reactions
  );

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
        <span
          key={group.content}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs border border-zinc-200 dark:border-zinc-700 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          <span>{getReactionEmoji(group.content)}</span>
          <span>{group.reactors.totalCount}</span>
        </span>
      ))}
    </div>
  );
};

export default PullRequestReactions;
