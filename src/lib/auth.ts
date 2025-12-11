// 🤠 Git Ranch - Cowboy Authentication
// GitHub OAuth configuration for saddlin' up with the ranch

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

// Generate a random trail token for OAuth security
function generateTrailToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 🐴 Saddle up and ride to GitHub for authentication
export function initiateGitHubLogin(): void {
  const state = generateTrailToken();
  // Stash the trail token in the bunkhouse for when we return
  localStorage.setItem("trail_token", state);

  console.log("🐴 Headin' out to GitHub with trail token:", state);
  console.log("🏠 Bunkhouse storage:", localStorage.getItem("trail_token"));

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user user:email repo",
    state,
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// 🏤 Check in at the tradin' post with yer authorization papers
export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<string | null> {
  const savedState = localStorage.getItem("trail_token");

  console.log("🏤 Trail Post Check:", {
    receivedPapers: state,
    expectedPapers: savedState,
    papersMatch: state === savedState,
  });

  if (state !== savedState) {
    console.error(
      "🚨 Whoa there! Trail papers don't match - possible cattle rustler!"
    );
    console.error("Received papers:", state);
    console.error("Expected papers:", savedState);
    return null;
  }

  localStorage.removeItem("trail_token");

  try {
    // Trade the authorization code for a ranch pass at the tradin' post
    const response = await fetch("http://localhost:3001/auth/github/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("🌵 Failed to get yer ranch pass from the tradin' post");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("🌪️ Dust storm at the tradin' post:", error);
    return null;
  }
}

// 🤠 Fetch cowboy info from GitHub
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
      throw new Error("🤔 Couldn't find yer cowboy records");
    }

    return await response.json();
  } catch (error) {
    console.error("🌵 Error fetchin' cowboy info:", error);
    return null;
  }
}

// 🏠 Bunkhouse storage helpers
export function saveAuthState(state: AuthState): void {
  localStorage.setItem("ranch_hand", JSON.stringify(state));
}

export function loadAuthState(): AuthState {
  const stored = localStorage.getItem("ranch_hand");
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
  localStorage.removeItem("ranch_hand");
}
