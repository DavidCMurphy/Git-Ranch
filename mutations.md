Note: I'm quite open to removing or deprioritising the optimistic updates here. It's a shame we don't have an example of `optimisticResponse`, and the others look a bit complicated. Not sure they really sell relay's abilities as much as we'd like

This is also AI generated as I'm out of time, not sure this is that useful. Feel free to discard this if not suitable

# Relay Workshop: Mutations

In this section, we'll implement the ability to add and remove reactions from pull requests. We'll cover:

1.  Defining GraphQL mutations
2.  Using the `useMutation` hook
3.  Implementing **optimistic updates** for instant UI feedback
4.  Using both standard Store updates and **Updatable Fragments** (maybe we omit one or both of these. I'd be nice to say that the order of preference for the APIS here is `optimisticResponse` -> `optimisticUpdater` with `@refetchable` -> `optimisticUpdater` with non-typesafe, old `store` apis)

## 1. Adding a Reaction (`AddReactionButton.tsx`)

We'll start by allowing users to add a reaction. Open `src/components/AddReactionButton.tsx`.

### Define the Mutation

First, we define the mutation to add a reaction. This mutation takes an `input` and returns the updated reaction object.

```typescript
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
```

### Implement the Handler with Optimistic Update

When the user selects an emoji, we want to update the UI immediately, before the server responds. We'll use Relay's **Updatable Fragments** feature for a clean optimistic update.

Ensure your fragment definition includes the `@updatable` directive on the `ReactionGroup` (this might already be in a separate file or defined locally):

```graphql
fragment AddReactionButton_updatable on ReactionGroup @updatable {
  content
  viewerHasReacted
  reactors {
    totalCount
  }
}
```

Now, implement `handleAddReaction`:

```typescript
const handleAddReaction = (content: ReactionContent) => {
  // Check if we already reacted
  const reactionGroup = data.reactionGroups?.find(
    (group) => group?.content === content
  );

  if (reactionGroup?.viewerHasReacted) {
    return;
  }

  commitAdd({
    variables: {
      input: {
        subjectId: data.id,
        content: content,
      },
    },
    // Optimistic Update using Updatable Fragments
    optimisticUpdater: (store) => {
      const reactionGroup = data.reactionGroups?.find(
        (group) => group?.content === content
      );

      if (!reactionGroup || reactionGroup?.viewerHasReacted) {
        setShowPicker(false);
        return;
      }

      // Read the updatable fragment
      const { updatableData } =
        store.readUpdatableFragment<AddReactionButton_updatable$key>(
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

      // Mutate the data directly
      updatableData.viewerHasReacted = true;
      updatableData.reactors.totalCount++;
    },
    onCompleted: () => setShowPicker(false),
  });
};
```

## 2. Removing a Reaction (`ReactionGroup.tsx`)

Next, let's handle removing a reaction. Open `src/components/ReactionGroup.tsx`.

### Define the Mutation

```typescript
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
```

### Implement the Handler with Store API

For this example, we'll use the imperative **Store API** for the optimistic update. This is the traditional way to handle complex updates in Relay.

```typescript
const handleRemoveReaction = (content: ReactionContent) => {
  commitRemove({
    variables: {
      input: {
        subjectId: data.subject.id,
        content: content,
      },
    },
    optimisticUpdater: (store) => {
      // 1. Get the subject record
      const subject = store.get(data.subject.id);

      // 2. Traverse to the reaction groups
      const groups = subject?.getLinkedRecords("reactionGroups");
      const group = groups?.find((g) => g.getValue("content") === data.content);

      // 3. Update the values
      const reactors = group?.getLinkedRecord("reactors");
      const totalCount = Number(reactors?.getValue("totalCount")) ?? 0;

      reactors?.setValue(totalCount - 1, "totalCount");
      group?.setValue(false, "viewerHasReacted"); // Set to false since we're removing
    },
  });
};
```

## Summary

- **`useMutation`**: The primary hook for triggering mutations.
- **Optimistic Updates**: Crucial for a snappy user experience.
- **Updatable Fragments**: A newer, more declarative API for local data updates (`readUpdatableFragment`).
- **Store API**: The imperative API for manual store manipulation (`store.get`, `setValue`, etc.).
