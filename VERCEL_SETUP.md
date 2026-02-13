# Quick Vercel Setup Guide

## How Environment Variables Work in Vercel

When you deploy to Vercel, environment variables are:
- ✅ **Stored securely** in Vercel's dashboard (not in your code)
- ✅ **Injected at build time** by Vercel
- ✅ **Never committed** to GitHub (your `.env.local` is git-ignored)

## Step-by-Step: Adding API Key to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Environment Variables**
   - Click **Settings** (gear icon)
   - Click **Environment Variables** in the left sidebar

3. **Add the Variable**
   ```
   Name:  VITE_GEMINI_API_KEY
   Value: AIzaSyB7JX7wkuH4UC3hahIsTMkKkgF2LmCf7Ug
   ```
   - Check all environments: Production, Preview, Development
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on your latest deployment
   - Click **Redeploy**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Add environment variable
vercel env add VITE_GEMINI_API_KEY

# When prompted, enter your API key
# Select environments: Production, Preview, Development

# Redeploy
vercel --prod
```

## Verify It's Working

After redeployment:
1. Open your deployed site
2. Open browser DevTools (F12)
3. Check Console - you should NOT see: "GEMINI_API_KEY is not set"
4. Try running a compliance audit - it should work!

## Troubleshooting

**Problem:** Still seeing "API Key Not Configured" error
- ✅ Make sure you redeployed after adding the env var
- ✅ Check the variable name is exactly `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY`
- ✅ Verify it's enabled for the environment you're testing (Production/Preview)

**Problem:** Build fails
- ✅ Check Vercel build logs for errors
- ✅ Ensure Node.js version is compatible (Vercel auto-detects)

## Security Best Practices

- ✅ Never commit `.env.local` to GitHub (already in `.gitignore`)
- ✅ Never hardcode API keys in your source code
- ✅ Use Vercel's environment variables for all secrets
- ✅ Rotate API keys if they're ever exposed
