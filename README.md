# 🤠 Git Ranch - Wrangle Yer Pull Requests

![Git Ranch - Cattle Roundup](./example.png)

Yeehaw, partner! Git Ranch is a rootin' tootin' Vite + React application that lets you saddle up with GitHub and wrangle all yer open pull requests using the GitHub GraphQL API with Relay.

## Features

- 🐴 **Saddle Up** - GitHub OAuth authentication to join the ranch
- 🐄 **Cattle Roundup** - GraphQL queries using Relay to round up yer PRs
- 🤠 **Wrangle PRs** - View all yer open pull requests across the range
- 🏷️ **Brand Checkin'** - See review status (Branded & Ready, Needs Re-shoein', Needs Inspectin')
- 🎨 **Ranch Style** - Modern UI with Tailwind CSS
- 📱 **Trail Ready** - Responsive design for cowboys on the go
- 🌙 **Night Ridin'** - Dark mode for late night wranglin'
- ⚡ **Fast as Lightnin'** - Type-safe with TypeScript
- 🚀 **Quick Draw** - Fast development with Vite

## The Outfit (Tech Stack)

- **Vite** - Build tool faster than a rattlesnake strike
- **React 18** - UI library for buildin' the ranch house
- **React Router** - Trail markers for client-side routing
- **Relay** - GraphQL wrangler for fetchin' data
- **Express** - OAuth token exchange at the tradin' post
- **GitHub GraphQL API** - The cattle source
- **Tailwind CSS v4** - Ranch stylin'
- **TypeScript** - Type safety like a good fence

## Hitchin' Up Instructions

### 1. Register Yer Brand at GitHub

1. Mosey on over to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the ranch details:
   - **Application name**: Git Ranch (or whatever brand ya fancy)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/callback`
4. Click "Register application"
5. Copy the **Client ID** (yer ranch brand)
6. Generate a new **Client Secret** and copy it (keep it secret, keep it safe)

### 2. Set Up the Bunkhouse (.env)

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add yer credentials:
   ```env
   VITE_GITHUB_CLIENT_ID=yer_github_client_id
   GITHUB_CLIENT_SECRET=yer_github_client_secret
   VITE_REDIRECT_URI=http://localhost:3000/callback
   PORT=3001
   ```

### 3. Stock the Barn (Install Dependencies)

```bash
npm install
```

### 4. Prep the Lassos (Compile Relay Queries)

```bash
npm run relay
```

### 5. Open the Ranch Gates

This'll start both the OAuth server (port 3001) and Vite dev server (port 3000):

```bash
npm start
```

Or run 'em separately like two cowboys on patrol:

```bash
# Terminal 1 - The Tradin' Post (OAuth server)
npm run server

# Terminal 2 - The Ranch House (Vite dev server)
npm run dev
```

Ride on over to [http://localhost:3000](http://localhost:3000) in yer browser.

## How to Wrangle

1. Click "🐴 Saddle Up with GitHub" at the saloon entrance
2. Authorize the ranch to access yer GitHub
3. View yer cattle (pull requests) with all the details:
   - 🐮 PR title and number (cattle tag)
   - 🏠 Repository name (which pasture)
   - 🔀 Branch information (head → base trail)
   - 🏷️ Brandin' status (Branded & Ready, Needs Re-shoein', Needs Inspectin')
   - 📝 Draft status (Still Ropin')
   - ➕➖ Code changes (+additions / -deletions)
   - 🌅 When the roundup started and last wrangled

## Ranch Layout (Project Structure)

```
├── src/
│   ├── components/
│   │   ├── RoundupList.tsx      # Cattle list (PRs) with Relay query
│   │   └── Tumbleweed.tsx       # Error boundary (when things go sideways)
│   ├── pages/
│   │   ├── Saloon.tsx           # Main gathering hall
│   │   └── TrailPost.tsx        # OAuth callback checkpoint
│   ├── lib/
│   │   ├── auth.ts              # Cowboy authentication
│   │   └── relay/
│   │       └── environment.ts   # Relay environment
│   ├── App.tsx                  # The whole dang ranch
│   ├── main.tsx                 # Ranch entrance
│   └── index.css                # Ranch dress code
├── __generated__/               # Relay generated files
├── server.js                    # OAuth token tradin' post
├── vite.config.ts               # Vite configuration
├── relay.config.js              # Relay compiler configuration
└── schema.graphql               # GitHub GraphQL schema (the brand book)
```

## Ranch Commands

- `npm start` - Open the ranch (both servers)
- `npm run dev` - Just the ranch house (Vite)
- `npm run server` - Just the tradin' post (OAuth)
- `npm run build` - Prep for the cattle drive (production build)
- `npm run preview` - Preview the finished ranch
- `npm run relay` - Compile them Relay queries
- `npm run lint` - Check for varmints in the code

## Trail Guides & Wisdom

- [Vite Documentation](https://vite.dev/) - Fast build tool knowledge
- [React Documentation](https://react.dev/) - React wisdom
- [Relay Documentation](https://relay.dev/docs/) - GraphQL wranglin' guide
- [React Router Documentation](https://reactrouter.com/) - Trail navigation
- [GitHub GraphQL API](https://docs.github.com/en/graphql) - The cattle source docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Ranch stylin' guide

---

_Happy trails, partner!_ 🤠🐴
