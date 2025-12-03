// GitHub OAuth configuration
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || "http://localhost:3000/callback";

export interface GitHubUser {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface AuthState {
  accessToken: string | null;
  user: GitHubUser | null;
}

// Generate a random state for OAuth security
function generateState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Initiate GitHub OAuth flow
export function initiateGitHubLogin(): void {
  const state = generateState();
  // Use localStorage instead of sessionStorage for better reliability across redirects
  localStorage.setItem("oauth_state", state);

  console.log("Initiating OAuth login with state:", state);
  console.log(
    "LocalStorage after setting:",
    localStorage.getItem("oauth_state")
  );

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user user:email repo",
    state,
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// Handle OAuth callback
export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<string | null> {
  const savedState = localStorage.getItem("oauth_state");

  console.log("OAuth State Check:", {
    receivedState: state,
    savedState: savedState,
    match: state === savedState,
  });

  if (state !== savedState) {
    console.error("State mismatch - possible CSRF attack");
    console.error("Received state:", state);
    console.error("Saved state:", savedState);
    return null;
  }

  localStorage.removeItem("oauth_state");

  try {
    // Note: In production, this should go through your backend
    // For development, you'll need to set up a simple proxy server
    const response = await fetch("http://localhost:3001/auth/github/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
}

// Fetch user info from GitHub
export async function fetchGitHubUser(
  accessToken: string
): Promise<GitHubUser | null> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

// Storage helpers
export function saveAuthState(state: AuthState): void {
  localStorage.setItem("auth_state", JSON.stringify(state));
}

export function loadAuthState(): AuthState {
  const stored = localStorage.getItem("auth_state");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { accessToken: null, user: null };
    }
  }
  return { accessToken: null, user: null };
}

export function clearAuthState(): void {
  localStorage.removeItem("auth_state");
}
