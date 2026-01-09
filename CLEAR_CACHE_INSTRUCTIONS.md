# Clear Cache on Mobile Phone - Instructions

## For Android (Chrome):
1. Open Chrome on your phone
2. Go to: `chrome://settings/privacy`
3. Tap "Clear browsing data"
4. Select "Cached images and files" and "Site settings"
5. Choose "Last hour" or "All time"
6. Tap "Clear data"
7. OR: Long-press the app icon → App info → Storage → Clear cache

## For iOS (Safari):
1. Go to Settings → Safari
2. Tap "Clear History and Website Data"
3. Confirm
4. OR: Settings → General → iPhone Storage → Find "SophiAI" → Offload App → Reinstall

## Quick Fix (Recommended):
1. **Delete the app from your home screen** (long press → Remove)
2. **Go to the website in Chrome/Safari**: https://llomj.github.io/SophiAI/
3. **Clear browser cache**: Settings → Clear browsing data
4. **Re-add to home screen**: Menu → Add to Home Screen
5. **Open the newly added app**

## Force Service Worker Update:
If the above doesn't work, you can force update the service worker:
1. Open the app
2. Open browser DevTools (if possible) or use remote debugging
3. Go to Application → Service Workers
4. Click "Unregister"
5. Refresh the page
