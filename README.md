#this app is a philosophical app where user can converse with different DNA metric systems. App is customisable. API key required for app.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1PGpZAg8U5iY_LulbmAEjoZ3Kw3Fj4R13

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```
   
   Or manually create `.env.local` with:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

3. Run the app:
   ```bash
   npm run dev
   ```

**Important:** If you see "API key not configured" errors, make sure:
- The `.env.local` file exists in the project root
- It contains `GEMINI_API_KEY=your_actual_key`
- You've restarted the dev server after creating/updating the file
