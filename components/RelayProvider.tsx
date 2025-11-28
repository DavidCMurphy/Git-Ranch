"use client";

import { ReactNode, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "@/lib/relay/clientEnvironment";

interface RelayProviderProps {
  children: ReactNode;
  accessToken: string;
}

export default function RelayProvider({
  children,
  accessToken,
}: RelayProviderProps) {
  const environment = useMemo(
    () => getClientEnvironment(accessToken),
    [accessToken]
  );

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}

