# Vercel Environment Variable Troubleshooting

## Quick Checklist

If you're still getting the API key error after deployment:

### ✅ Step 1: Verify Variable is Set in Vercel
1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Look for either:
   - `VITE_GEMINI_API_KEY` OR
   - `GEMINI_API_KEY`
4. Make sure it's enabled for **Production** (and Preview if testing preview deployments)

### ✅ Step 2: Verify Variable Value
- Click on the variable to see its value
- Make sure it's exactly: `AIzaSyB7JX7wkuH4UC3hahIsTMkKkgF2LmCf7Ug`
- No extra spaces, no quotes

### ✅ Step 3: Redeploy After Adding Variable
**CRITICAL:** After adding/changing an environment variable, you MUST redeploy:
1. Go to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Click **Redeploy**
4. Wait for build to complete

### ✅ Step 4: Check Build Logs
In the Vercel build logs, you should see:
```
Running "vite build"
vite v6.4.1 building for production...
transforming...
✓ 1716 modules transformed.
✓ built in X.XXs
```

If the build succeeds but you still get the error, the env var might not be available.

## Common Issues

### Issue 1: Variable Not Set
**Symptom:** Console shows "GEMINI_API_KEY is not set"
**Solution:** Add the variable in Vercel Settings → Environment Variables

### Issue 2: Wrong Variable Name
**Symptom:** Variable is set but still not working
**Solution:** Use exactly `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` (both work)

### Issue 3: Not Redeployed
**Symptom:** Variable is set but old build is still running
**Solution:** Go to Deployments → Redeploy

### Issue 4: Wrong Environment
**Symptom:** Works in Preview but not Production (or vice versa)
**Solution:** Make sure variable is enabled for the environment you're testing

## Testing

After redeployment:
1. Open your deployed site
2. Open browser DevTools (F12) → Console
3. You should NOT see: "GEMINI_API_KEY is not set"
4. Try running a compliance audit

## Still Not Working?

1. **Double-check the variable name** - must be exactly `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY`
2. **Check for typos** in the API key value
3. **Verify it's enabled for Production** environment
4. **Redeploy** - this is the most common issue!
5. **Check Vercel build logs** for any errors during build
