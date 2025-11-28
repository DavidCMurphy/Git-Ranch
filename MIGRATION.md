# Migration from Next.js to Vite

This document outlines the changes made when migrating from Next.js to Vite.

## Major Changes

### 1. Build Tool
- **Before**: Next.js (framework with built-in bundler)
- **After**: Vite (fast build tool with dev server)

### 2. Project Structure
- **Before**: `app/` directory with Next.js App Router
- **After**: `src/` directory with standard React structure

### 3. Authentication
- **Before**: NextAuth.js with API routes
- **After**: Custom OAuth implementation with Express backend

### 4. Routing
- **Before**: File-based routing with Next.js
- **After**: React Router with client-side routing

### 5. Environment Variables
- **Before**: `NEXTAUTH_*` variables, no prefix required
- **After**: `VITE_*` prefix required for client-side variables

## File Changes

### Removed Files/Directories
- `app/` - Next.js app directory
- `next.config.ts` - Next.js configuration
- `next-env.d.ts` - Next.js type definitions
- `.env.local.example` - Next.js env template
- `types/next-auth.d.ts` - NextAuth type extensions
- `lib/relay/clientEnvironment.ts` - Separate client environment (merged)
- `components/SessionProvider.tsx` - NextAuth session provider
- `components/RelayProvider.tsx` - Relay provider component

### New Files/Directories
- `src/` - Main source directory
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root application component
- `src/pages/HomePage.tsx` - Main page component
- `src/pages/CallbackPage.tsx` - OAuth callback handler
- `src/lib/auth.ts` - OAuth authentication logic
- `src/lib/relay/environment.ts` - Unified Relay environment
- `vite.config.ts` - Vite configuration
- `index.html` - HTML entry point (required by Vite)
- `server.js` - Express server for OAuth token exchange
- `.env.example` - Vite env template
- `relay.config.json` - Relay config (was .js, now .json for ES modules)

### Modified Files
- `package.json` - Updated dependencies and scripts
- `tsconfig.json` - Updated for Vite
- `.gitignore` - Added `/dist` for Vite build output
- `README.md` - Updated documentation

## Dependency Changes

### Removed
- `next` - Next.js framework
- `next-auth` - NextAuth.js
- `@auth/core` - Auth.js core
- `eslint-config-next` - Next.js ESLint config
- `react@19` - Downgraded to React 18 for better compatibility

### Added
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `react-router-dom` - Client-side routing
- `express` - OAuth server
- `cors` - CORS middleware for Express
- `dotenv` - Environment variable loading
- `concurrently` - Run multiple commands
- `@types/express` - Express types
- `@types/cors` - CORS types

## Configuration Changes

### Environment Variables
**Before (.env.local):**
```env
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
```

**After (.env):**
```env
VITE_GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
VITE_REDIRECT_URI=...
PORT=3001
```

### Scripts
**Before:**
```json
{
  "dev": "next dev",
  "build": "relay-compiler && next build",
  "start": "next start"
}
```

**After:**
```json
{
  "dev": "vite",
  "build": "relay-compiler && tsc -b && vite build",
  "start": "concurrently \"npm run server\" \"npm run dev\"",
  "server": "node server.js",
  "preview": "vite preview"
}
```

## OAuth Flow Changes

### Before (NextAuth.js)
1. User clicks "Sign in with GitHub"
2. NextAuth handles OAuth flow automatically
3. Session stored server-side
4. Access token available in session

### After (Custom Implementation)
1. User clicks "Sign in with GitHub"
2. Client redirects to GitHub OAuth
3. GitHub redirects to `/callback` with code
4. Client sends code to Express server
5. Server exchanges code for access token
6. Client stores token in localStorage
7. Client fetches user info from GitHub API

## Running the Application

### Before
```bash
npm run dev
```

### After
```bash
# Option 1: Run both servers together
npm start

# Option 2: Run separately
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

## Important Notes

1. **OAuth Server Required**: The Express server (`server.js`) is required to exchange the OAuth code for an access token securely. The client secret cannot be exposed in the browser.

2. **GitHub OAuth App Update**: You need to update your GitHub OAuth app's callback URL from:
   - Before: `http://localhost:3000/api/auth/callback/github`
   - After: `http://localhost:3000/callback`

3. **State Management**: Authentication state is now managed in React state and localStorage instead of server-side sessions.

4. **No SSR**: Unlike Next.js, this is a pure client-side application. All rendering happens in the browser.

5. **Relay Environment**: The Relay environment is now created once per access token and reused, instead of being recreated on each request.

