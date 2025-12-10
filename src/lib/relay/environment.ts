import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://api.github.com/graphql";

// Demo flag: set to true to inject fake field errors for every 3rd PR
const DEMO_FIELD_ERRORS = true;

let clientEnvironment: Environment | null = null;

// Inject fake field errors into pull request responses for demo purposes
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
