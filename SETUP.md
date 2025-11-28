# Quick Setup Guide

Follow these steps to get the application running:

## Prerequisites

- Node.js 20.9.0 or higher
- A GitHub account
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create GitHub OAuth App

1. Visit: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `GraphQL Demo` (or your choice)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/callback`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
VITE_REDIRECT_URI=http://localhost:3000/callback
PORT=3001
```

### 4. Compile Relay Queries

```bash
npm run relay
```

This generates TypeScript types from your GraphQL queries.

### 5. Start the Application

Start both the OAuth server and Vite dev server:

```bash
npm start
```

This will run:
- OAuth server on http://localhost:3001
- Vite dev server on http://localhost:3000

Alternatively, run them separately in two terminals:

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

### 6. Open the Application

Visit http://localhost:3000 in your browser.

### 7. Use the Application

- Click "Sign in with GitHub"
- Authorize the application
- View your open pull requests!

## Troubleshooting

### "Invalid client_id or client_secret"
- Double-check your `VITE_GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env`
- Make sure there are no extra spaces or quotes
- Restart both servers after changing environment variables

### "Callback URL mismatch"
- Verify the callback URL in your GitHub OAuth app settings matches exactly:
  `http://localhost:3000/callback`

### OAuth server not running
- Make sure you're running `npm start` or `npm run server` in a separate terminal
- Check that port 3001 is not already in use

### Relay compilation errors
- Make sure the `__generated__` directory exists
- Try deleting `__generated__` and running `npm run relay` again

### TypeScript errors
- Run `npm run relay` to regenerate types
- Restart your IDE/editor

## Next Steps

Once running:
1. Click "Sign in with GitHub"
2. Authorize the application
3. View your repositories!

## Production Deployment

When deploying to production:

1. Update your GitHub OAuth app with production URLs
2. Set environment variables in your hosting platform
3. Run `npm run build` to compile the application
4. Deploy the `.next` folder

For Vercel deployment, it will handle most of this automatically.

