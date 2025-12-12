import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://api.github.com/graphql";

let clientEnvironment: Environment | null = null;

// Demo flag: set to true to inject fake field errors for every 3rd PR
const DEMO_FIELD_ERRORS = true;

function injectFieldErrors(response: any): any {
  if (!DEMO_FIELD_ERRORS) return response;

  // Check if this is a pull request query response (handles both nodes and edges patterns)
  const pullRequestsContainer = response?.data?.viewer?.pullRequests;
  const pullRequests =
    pullRequestsContainer?.edges ?? pullRequestsContainer?.nodes;
  if (!Array.isArray(pullRequests) || pullRequests.length === 0)
    return response;

  const errors: any[] = response.errors || [];
  const usesEdges = !!pullRequestsContainer?.edges;

  // Only affect the first PR in the list
  const firstPr = usesEdges ? pullRequests[0]?.node : pullRequests[0];
  if (firstPr && firstPr.assignees) {
    // The Wranglers fragment uses @connection with edges pattern
    const assigneesEdges = firstPr.assignees.edges;
    if (Array.isArray(assigneesEdges) && assigneesEdges.length > 0) {
      const firstAssignee = assigneesEdges[0]?.node;
      if (firstAssignee) {
        // Build the correct path for the error
        const basePath = usesEdges
          ? ["viewer", "pullRequests", "edges", 0, "node"]
          : ["viewer", "pullRequests", "nodes", 0];

        // Target the name field of the first assignee to trigger @throwOnFieldError
        const errorPath = [
          ...basePath,
          "assignees",
          "edges",
          0,
          "node",
          "name",
        ];

        errors.push({
          message: `Demo error: Failed to fetch assignee name for PR #${firstPr.number}`,
          path: errorPath,
          extensions: {
            code: "DEMO_ERROR",
          },
        });

        // Set the name field to null to simulate a field-level error
        // This combined with the error path will trigger @throwOnFieldError
        firstAssignee.name = null;
      }
    }
  }

  if (errors.length > 0) {
    response.errors = errors;
    console.log("Injected field errors:", response.errors);
  }

  return response;
}

export function createRelayEnvironment(accessToken: string): Environment {
  const fetchFn: FetchFunction = async (request, variables) => {
    const resp = await fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });

    const json = await resp.json();

    // Inject fake field errors for demo purposes
    return injectFieldErrors(json);
  };

  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export function getRelayEnvironment(accessToken: string): Environment {
  if (!clientEnvironment) {
    clientEnvironment = createRelayEnvironment(accessToken);
  }
  return clientEnvironment;
}

export function resetRelayEnvironment(): void {
  clientEnvironment = null;
}
