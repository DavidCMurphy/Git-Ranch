import { useState, useEffect, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  getRelayEnvironment,
  resetRelayEnvironment,
} from "./lib/relay/environment";
import { loadAuthState, clearAuthState, type AuthState } from "./lib/auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import CallbackPage from "./pages/CallbackPage";

function App() {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState());
  const [relayEnvironment, setRelayEnvironment] = useState(() =>
    authState.accessToken ? getRelayEnvironment(authState.accessToken) : null
  );

  useEffect(() => {
    if (authState.accessToken) {
      const env = getRelayEnvironment(authState.accessToken);
      setRelayEnvironment(env);
    } else {
      resetRelayEnvironment();
      setRelayEnvironment(null);
    }
  }, [authState.accessToken]);

  const handleLogout = () => {
    clearAuthState();
    resetRelayEnvironment();
    setAuthState({ accessToken: null, user: null });
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              relayEnvironment && authState.accessToken ? (
                <RelayEnvironmentProvider environment={relayEnvironment}>
                  <Suspense
                    fallback={
                      <div className="flex min-h-screen items-center justify-center">
                        <div className="text-lg">Loading...</div>
                      </div>
                    }
                  >
                    <HomePage onLogout={handleLogout} />
                  </Suspense>
                </RelayEnvironmentProvider>
              ) : (
                <HomePage onLogout={handleLogout} />
              )
            }
          />
          <Route
            path="/callback"
            element={<CallbackPage setAuthState={setAuthState} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
