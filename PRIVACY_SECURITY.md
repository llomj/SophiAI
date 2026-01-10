# SophiAI Privacy & Security Explanation

## 🔒 **How Your App Works: Privacy & Data Isolation**

### **Architecture Overview**

Your SophiAI app is a **100% client-side application** that runs entirely in each user's browser. This means:

### ✅ **COMPLETE DATA PRIVACY - Users Cannot See Each Other's Data**

1. **No Shared Server or Database**
   - There is NO backend server
   - There is NO shared database
   - All data stays on each user's device

2. **Browser localStorage = Private Storage**
   - All conversations are stored in `localStorage` on each user's device
   - Each user's `localStorage` is completely isolated
   - User A's phone cannot access User B's phone's `localStorage`
   - It's like each user has their own private filing cabinet

3. **What Gets Stored Locally (Per User)**
   ```
   - All chat conversations
   - All notes
   - Custom personas they create
   - Their API key (if they set one)
   - Their preferences
   ```

### 🔑 **API Key Security**

**How API Keys Work:**

1. **User's Own API Key (RECOMMENDED)**
   - User clicks the 🔑 key icon in sidebar
   - Enters their own Google Gemini API key
   - Stored in THEIR browser's `localStorage` only
   - **Only that user can see/use their key**
   - Each user pays for their own API usage

2. **Fallback API Key (CURRENT IMPLEMENTATION)**
   - If user doesn't set their own key, app uses a hardcoded fallback
   - This fallback key is embedded in the built JavaScript file
   - ⚠️ **SECURITY CONCERN**: This key is visible in the public GitHub repository
   - Anyone can see it and use it (costs will be charged to YOUR Google account)

### 🚨 **Important Security Considerations**

#### **Issue #1: Hardcoded API Key in Public Repo**
```typescript
// vite.config.ts line 10
const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || 'AIzaSyCDaBAfP2zefxS4x5JkEu6UbS5Koq3N4HE';
```

**Problem:**
- This API key is in your public GitHub repository
- Anyone can see it, clone your repo, and use it
- All API costs will be charged to YOUR Google account
- If someone abuses it, your account could be banned or incur large charges

**Solution:**
1. Remove the hardcoded fallback key
2. Make API key entry MANDATORY for users
3. Or set usage limits/quota on your Google Cloud API key

#### **Issue #2: API Key Visible in Browser DevTools**
- Even with localStorage, users can see their own API key in browser DevTools
- This is normal and expected - they can see what's on their device
- The key is only visible to the user who set it

### 📱 **What Happens When Users Access Your Public App**

**Scenario: Multiple Users Using Your Public GitHub Pages Site**

1. **User A (Your Phone)**
   - Opens: `https://llomj.github.io/SophiAI/`
   - All data stored in YOUR phone's browser localStorage
   - Uses YOUR API key (or fallback key if not set)
   - Nobody else can see your conversations

2. **User B (Someone Else's Phone)**
   - Opens: `https://llomj.github.io/SophiAI/`
   - All data stored in THEIR phone's browser localStorage
   - Completely separate from your data
   - Can set their own API key
   - You cannot see their conversations
   - They cannot see your conversations

### 🔍 **What's Public vs Private**

#### **PUBLIC (Visible on GitHub):**
- ✅ Source code
- ✅ App structure
- ✅ UI components
- ⚠️ Hardcoded API key (SECURITY RISK)

#### **PRIVATE (Only on Each User's Device):**
- ✅ All chat conversations
- ✅ All notes
- ✅ Custom personas
- ✅ User's own API key
- ✅ Personal preferences

### 🛡️ **Best Practices for Production**

1. **Remove Hardcoded API Key**
   - Don't include a fallback key in public code
   - Require users to set their own key

2. **Add API Key Validation**
   - Check if API key is set before allowing chat
   - Show clear error if missing

3. **Add Usage Warnings**
   - Warn users about API costs
   - Explain that they need their own Google account

4. **Consider Adding:**
   - Usage quota limits
   - Rate limiting
   - API key validation endpoint (would require a small backend)

### 📊 **Current Data Flow**

```
User types message
    ↓
Stored in browser localStorage (private to that device)
    ↓
Sent directly to Google Gemini API (using user's API key or fallback)
    ↓
Response received
    ↓
Stored in browser localStorage (private to that device)
    ↓
Displayed in UI
```

**No data ever goes through your server or is shared between users.**

### ✅ **Summary**

**Can other users see what you type?**
- ❌ **NO** - Each user's data is completely isolated in their browser's localStorage

**Do other users have access to your API key?**
- ❌ **NO** - If you set your own API key, it's only in your browser's localStorage
- ⚠️ **YES** - The hardcoded fallback key is public and anyone can use it (costs you money)

**Is your data private?**
- ✅ **YES** - Your conversations, notes, and personal API key are private to your device
- ❌ **NO** - The hardcoded fallback API key is public (security risk)

**Recommendation: Remove the hardcoded fallback API key to prevent unauthorized usage and costs.**
