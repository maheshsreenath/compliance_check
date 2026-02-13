<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally and deploy to Vercel.

View your app in AI Studio: https://ai.studio/apps/drive/1x0Fw5zN_KzaUZlp3kcoFtnbVevjA-qf9

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   Or use `GEMINI_API_KEY` (both work):
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

### Step 1: Push to GitHub
Make sure your code is pushed to a GitHub repository. The `.env.local` file is git-ignored, so your API key won't be committed.

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 3: Add Environment Variable
**This is the key step!** You need to add your API key in Vercel's dashboard:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add the environment variable:
   - **Name:** `VITE_GEMINI_API_KEY` (or `GEMINI_API_KEY` - both work)
   - **Value:** `AIzaSyB7JX7wkuH4UC3hahIsTMkKkgF2LmCf7Ug` (your actual API key)
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
4. Click **Save**

### Step 4: Deploy
1. Go to the **Deployments** tab
2. Click **Redeploy** on your latest deployment (or push a new commit)
3. Vercel will rebuild with the environment variable

### Important Notes:
- ✅ The API key is **NOT** in your GitHub repository (it's in `.gitignore`)
- ✅ The API key is **ONLY** stored in Vercel's secure environment variables
- ✅ Each environment (Production/Preview/Development) can have different values
- ✅ After adding the env var, you must redeploy for it to take effect

### Verify It's Working
After deployment, check the browser console. You should NOT see the warning about missing API key, and AI compliance analysis should work.
