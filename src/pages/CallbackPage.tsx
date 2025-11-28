import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback, fetchGitHubUser, saveAuthState, type AuthState } from '../lib/auth';

interface CallbackPageProps {
  setAuthState: (state: AuthState) => void;
}

export default function CallbackPage({ setAuthState }: CallbackPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      setError('Missing authorization code or state');
      return;
    }

    async function processCallback() {
      try {
        const accessToken = await handleOAuthCallback(code!, state!);
        
        if (!accessToken) {
          setError('Failed to obtain access token');
          return;
        }

        const user = await fetchGitHubUser(accessToken);
        
        if (!user) {
          setError('Failed to fetch user information');
          return;
        }

        const newAuthState = { accessToken, user };
        saveAuthState(newAuthState);
        setAuthState(newAuthState);
        
        navigate('/', { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('An error occurred during authentication');
      }
    }

    processCallback();
  }, [searchParams, navigate, setAuthState]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="max-w-md p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Authentication Error
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center">
        <div className="text-lg mb-4">Completing authentication...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto"></div>
      </div>
    </div>
  );
}

