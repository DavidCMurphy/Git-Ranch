import { ReactionContent } from "../components/__generated__/ReactableReactions_reactions.graphql";

export const REACTION_TYPES: ReactionContent[] = [
  "THUMBS_UP",
  "THUMBS_DOWN",
  "LAUGH",
  "HOORAY",
  "CONFUSED",
  "HEART",
  "ROCKET",
  "EYES",
];

export type { ReactionContent };

export const getReactionEmoji = (content: ReactionContent): string => {
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
