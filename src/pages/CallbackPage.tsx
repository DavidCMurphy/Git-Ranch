import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  handleOAuthCallback,
  fetchGitHubUser,
  saveAuthState,
  type AuthState,
} from "../lib/auth";

interface CallbackPageProps {
  setBrandedCowboy: (state: AuthState) => void;
}

// 🏤 CallbackPage - The trail post where cowboys check in after OAuth
export const CallbackPage = ({ setBrandedCowboy }: CallbackPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trouble, setTrouble] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setTrouble("🌵 Whoa there partner! Missing yer trail papers");
      return;
    }

    async function checkInAtPost() {
      try {
        const accessToken = await handleOAuthCallback(code!, state!);

        if (!accessToken) {
          setTrouble("🐎 Dagnabbit! Failed to get yer ranch pass");
          return;
        }

        const user = await fetchGitHubUser(accessToken);

        if (!user) {
          setTrouble("🤔 Couldn't find yer cowboy credentials, partner");
          return;
        }

        const newAuthState = { accessToken, user };
        saveAuthState(newAuthState);
        setBrandedCowboy(newAuthState);

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Trail post error:", err);
        setTrouble("🌪️ A dust storm blew through during authentication");
      }
    }

    checkInAtPost();
  }, [searchParams, navigate, setBrandedCowboy]);

  if (trouble) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="max-w-md p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            🚫 Trail Trouble
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">{trouble}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
          >
            🏠 Head Back to the Ranch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center">
        <div className="text-lg mb-4">🐴 Ridin' into the ranch...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto"></div>
      </div>
    </div>
  );
};

export default CallbackPage;
