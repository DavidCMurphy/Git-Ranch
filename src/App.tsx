import { useState, useEffect, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  getRelayEnvironment,
  resetRelayEnvironment,
} from "./lib/relay/environment";
import { loadAuthState, clearAuthState, type AuthState } from "./lib/auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TumbleweedSpawner } from "./components/TumbleweedSpawner";
import { HomePage } from "./pages/HomePage";
import { CallbackPage } from "./pages/CallbackPage";

// 🤠 GitRanch - The main app component, yeehaw!
const GitRanch = () => {
  const [ranchHand, setRanchHand] = useState<AuthState>(loadAuthState());
  const [relayEnvironment, setRelayEnvironment] = useState(() =>
    ranchHand.accessToken ? getRelayEnvironment(ranchHand.accessToken) : null
  );

  useEffect(() => {
    if (ranchHand.accessToken) {
      const env = getRelayEnvironment(ranchHand.accessToken);
      setRelayEnvironment(env);
    } else {
      resetRelayEnvironment();
      setRelayEnvironment(null);
    }
  }, [ranchHand.accessToken]);

  const hitTheTrail = () => {
    clearAuthState();
    resetRelayEnvironment();
    setRanchHand({ accessToken: null, user: null });
  };

  return (
    <ErrorBoundary>
      <TumbleweedSpawner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              relayEnvironment && ranchHand.accessToken ? (
                <RelayEnvironmentProvider environment={relayEnvironment}>
                  <Suspense
                    fallback={
                      <div className="flex min-h-screen items-center justify-center">
                        <div className="text-lg">🐴 Saddlin' up...</div>
                      </div>
                    }
                  >
                    <HomePage
                      cowboy={ranchHand.user}
                      onHitTheTrail={hitTheTrail}
                    />
                  </Suspense>
                </RelayEnvironmentProvider>
              ) : (
                <HomePage cowboy={null} onHitTheTrail={hitTheTrail} />
              )
            }
          />
          <Route
            path="/callback"
            element={<CallbackPage setBrandedCowboy={setRanchHand} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default GitRanch;
