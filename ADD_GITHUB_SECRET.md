# How to Add GitHub Secret for API Key

## Quick Steps (2 minutes):

1. **Go to this URL** (you need to be signed in to GitHub):
   ```
   https://github.com/llomj/SophiAI/settings/secrets/actions
   ```

2. **Click "New repository secret"** button (top right)

3. **Fill in the form:**
   - **Name:** `GEMINI_API_KEY`
   - **Secret:** `AIzaSyCDaBAfP2zefxS4x5JkEu6UbS5Koq3N4HE`
   
4. **Click "Add secret"**

5. **Trigger a new build:**
   - Go to: https://github.com/llomj/SophiAI/actions
   - Click "Deploy SophiAI" workflow
   - Click "Run workflow" button (top right)
   - Select "main" branch
   - Click "Run workflow"

6. **Wait for deployment** (~2 minutes)

7. **On your phone:**
   - Remove the app from home screen
   - Clear browser cache
   - Visit: https://llomj.github.io/SophiAI/
   - Re-add to home screen

That's it! The phone app will now have the API key built in.
