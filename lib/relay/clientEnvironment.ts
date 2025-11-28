"use client";

import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://api.github.com/graphql";

let clientEnvironment: Environment | null = null;

export function createClientEnvironment(accessToken: string): Environment {
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

    return await resp.json();
  };

  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export function getClientEnvironment(accessToken: string): Environment {
  if (!clientEnvironment) {
    clientEnvironment = createClientEnvironment(accessToken);
  }
  return clientEnvironment;
}

