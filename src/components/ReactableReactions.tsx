import { graphql, useFragment } from "react-relay";
import AddReactionButton from "./AddReactionButton";
import ReactionGroup from "./ReactionGroup";
import { ReactableReactions_reactable$key } from "./__generated__/ReactableReactions_reactable.graphql";

type Props = {
  reactable: ReactableReactions_reactable$key;
};

const ReactableReactions = ({ reactable }: Props) => {
  const data = useFragment(
    graphql`
      fragment ReactableReactions_reactable on Reactable {
        ...AddReactionButton_reactable
        reactionGroups {
          content
          ...ReactionGroup_group
        }
      }
    `,
    reactable
  );

  if (!data.reactionGroups) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-3 items-center relative">
      {data.reactionGroups.map((group) => (
        <ReactionGroup key={group.content} group={group} />
      ))}

      <AddReactionButton reactable={data} />
    </div>
  );
};

export default ReactableReactions;
