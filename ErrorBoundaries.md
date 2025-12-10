Handover

Thats great Taz, collections look like they work really well for lists of data. However we are still having to props drill data into each of the pull request list cells and in a larger component this can really start scaling poorly, where the root holds all the context for its children.

And when an error throws it is handled at the root only causing the entire list to fail.

This is where fragments really come into their own, they allow us to scope the management of data more granularly to the component concerned with it.

break down the fragment into the component

```typescript
onst PullRequest = ({ pr }: { pr: PullRequest_pr$key }) => {
  const data = useFragment(
    graphql`
      fragment PullRequest_pr on PullRequest {
        id
        number
        title
        url
        state
        isDraft
        createdAt
        updatedAt
        repository {
          name
          nameWithOwner
        }
        baseRefName
        headRefName
        additions
        deletions
        reviewDecision
      }
    `,
    pr
  );
```

When we do this we also get a more granual approach to error handling.

So what happens when we things dont go as expected and we get an error in our data? For example, what we don't have permission to access a particular piece of data? How do we handle that?

With fragments we can now wrap each pull request component in its own boundary. Doing this we can now also adopt a more strict approach to field errors by adapting the `throwOnFieldError` directive.

```typescript
<div className="grid gap-4">
  {pullRequests.map((pr, index) => (
    <PullRequestErrorBoundary key={index}>
      <PullRequest pr={pr} />
    </PullRequestErrorBoundary>
  ))}
</div>
```

Now we are handling any errors in our schema explicitly but also at a granualar level, preserving the integrity of the rest of the list.

lets throw a field error to see what that looks like.

```typescript
function injectFieldErrors(response: any): any {
  if (!DEMO_FIELD_ERRORS) return response;

  // Check if this is a pull request query response
  const pullRequests = response?.data?.viewer?.pullRequests?.nodes;
  if (!Array.isArray(pullRequests)) return response;

  const errors: any[] = response.errors || [];

  pullRequests.forEach((pr: any, index: number) => {
    // Inject a field error for every 3rd PR's title field
    errors.push({
      message: `Demo error: Failed to fetch title for PR #${pr.number}`,
      path: ["viewer", "pullRequests", "nodes", index, "title"],
      extensions: {
        code: "DEMO_ERROR",
      },
    });
    // Set the field to null to simulate a field-level error
    pr.title = null;
  });

  if (errors.length > 0) {
    response.errors = errors;
    console.log("Injected field errors:", response.errors);
  }

  return response;
}
```
