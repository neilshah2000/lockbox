# Firebase Setup Guide - Step by Step

Follow these steps to set up Firebase for Lockbox authentication and database.

**Estimated time:** 15-20 minutes

---

## Prerequisites

- Google account
- Chrome browser (recommended)
- The Lockbox project on your computer

---

## Step 1: Create Firebase Project (5 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Project name: `lockbox` (or your preferred name)
   - Click "Continue"

3. **Disable Google Analytics** (optional but recommended for now)
   - Toggle off "Enable Google Analytics for this project"
   - Click "Create project"
   - Wait for project creation (30-60 seconds)
   - Click "Continue" when done

---

## Step 2: Enable Google Authentication (3 minutes)

1. **Navigate to Authentication**
   - In the left sidebar, click "Build" → "Authentication"
   - Click "Get started"

2. **Enable Google Sign-In Provider**
   - Click on "Google" in the providers list
   - Toggle "Enable" to ON
   - Project support email: Enter your email address
   - Click "Save"

✅ Google Sign-In is now enabled!

---

## Step 3: Set Up Realtime Database (3 minutes)

1. **Navigate to Realtime Database**
   - In the left sidebar, click "Build" → "Realtime Database"
   - Click "Create Database"

2. **Choose Database Location**
   - Select: `United States (us-central1)` (recommended)
   - Click "Next"

3. **Set Security Rules**
   - Choose: "Start in **test mode**"
   - Click "Enable"

   **Note:** Test mode allows read/write access for 30 days. We'll add proper security rules later in development.

✅ Realtime Database is now created!

---

## Step 4: Get Firebase Configuration (3 minutes)

1. **Open Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview" in the left sidebar
   - Click "Project settings"

2. **Add a Web App**
   - Scroll down to "Your apps" section
   - Click the web icon `</>` (third icon after iOS and Android)

3. **Register App**
   - App nickname: `lockbox-web-config`
   - **Don't** check "Also set up Firebase Hosting"
   - Click "Register app"

4. **Copy Configuration Values**
   - You'll see a `firebaseConfig` object
   - **Keep this tab open** - you'll need these values

   Example (yours will be different):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "lockbox-xxxxx.firebaseapp.com",
     projectId: "lockbox-xxxxx",
     storageBucket: "lockbox-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890",
     databaseURL: "https://lockbox-xxxxx-default-rtdb.firebaseio.com"
   };
   ```

   **Don't close this tab yet!**

5. **Click "Continue to console"**

---

## Step 5: Configure Google OAuth for Android (5 minutes)

This is the most technical step but important for Google Sign-In to work.

### 5a. Get Your App Package Name

1. **Open a terminal** and run:
   ```bash
   cd /Users/neilshah/lockbox/app
   cat app.json | grep "package"
   ```

2. **Copy the package name** (e.g., `com.neilshah.lockbox`)

### 5b. Get Your SHA-1 Certificate Fingerprint

1. **Run this command** in terminal:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
   ```

2. **Copy the SHA-1 fingerprint** (looks like: `AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12`)

### 5c. Add Android App to Firebase

1. **Back in Firebase Console:**
   - Go to Project Settings (gear icon ⚙️)
   - Scroll down to "Your apps"
   - Click the Android icon (robot icon)

2. **Register Android App:**
   - Android package name: Paste the package name from 5a
   - App nickname: `lockbox-android`
   - Debug signing certificate SHA-1: Paste the SHA-1 from 5b
   - Click "Register app"

3. **Download config file (optional):**
   - Click "Download google-services.json"
   - Save it (we may need it later)
   - Click "Next" → "Next" → "Continue to console"

### 5d. Create OAuth Client ID in Google Cloud

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Make sure your Firebase project is selected (top left dropdown)

2. **Enable Google Sign-In API:**
   - Go to: APIs & Services → Library
   - Search for "Google Sign-In"
   - Click "Google Sign-In API"
   - If not enabled, click "Enable"

3. **Create OAuth Consent Screen:**
   - Go to: APIs & Services → OAuth consent screen
   - User Type: Choose "External"
   - Click "Create"
   - App name: `Lockbox`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (use defaults)
   - Test users: Add your email as a test user
   - Click "Save and Continue"

4. **Create OAuth Client ID for Android:**
   - Go to: APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Android"
   - Name: `Lockbox Android`
   - Package name: Your package name from 5a
   - SHA-1 certificate fingerprint: Your SHA-1 from 5b
   - Click "Create"

5. **Copy the Android Client ID:**
   - You'll see a dialog with your Client ID
   - Copy the Client ID (looks like: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`)
   - Click "OK"

---

## Step 6: Add Configuration to Your App (2 minutes)

1. **Navigate to your app directory:**
   ```bash
   cd /Users/neilshah/lockbox/app
   ```

2. **Create .env file from template:**
   ```bash
   cp .env.example .env
   ```

3. **Edit the .env file:**
   ```bash
   # Open with your editor
   nano .env
   # or
   code .env
   ```

4. **Fill in the values** from Step 4 and Step 5:

   ```env
   # From Step 4 - Firebase config
   FIREBASE_API_KEY=your_api_key_from_step_4
   FIREBASE_AUTH_DOMAIN=your_auth_domain_from_step_4
   FIREBASE_PROJECT_ID=your_project_id_from_step_4
   FIREBASE_STORAGE_BUCKET=your_storage_bucket_from_step_4
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id_from_step_4
   FIREBASE_APP_ID=your_app_id_from_step_4
   FIREBASE_DATABASE_URL=your_database_url_from_step_4

   # From Step 5d - Google Cloud OAuth
   GOOGLE_ANDROID_CLIENT_ID=your_android_client_id_from_step_5d

   # Leave these for later (iOS support)
   GOOGLE_IOS_CLIENT_ID=
   GOOGLE_EXPO_CLIENT_ID=
   ```

5. **Save the file** (Ctrl+O then Enter in nano, or just save in your editor)

6. **Verify .env is in .gitignore:**
   ```bash
   grep ".env" .gitignore
   ```
   Should show `.env` is listed (so it won't be committed to git)

---

## Step 7: Test Firebase Connection (2 minutes)

1. **Restart Expo server:**
   ```bash
   npx expo start --clear
   ```

2. **Look for errors** in the terminal
   - If you see Firebase connection errors, double-check your .env values
   - Make sure there are no extra spaces or quotes

3. **Open app on your phone** via Expo Go
   - The Login screen should load
   - No errors should appear

---

## Troubleshooting

### "Firebase config is invalid"
- Check that all values in .env are correct
- No quotes around values
- No extra spaces
- All fields filled in

### "SHA-1 certificate not found"
- Make sure you ran the keytool command correctly
- The debug.keystore should be in ~/.android/
- Try restarting terminal and running again

### "Package name mismatch"
- The package name in app.json must match the one in Google Cloud Console
- Make sure you copied it exactly

### "OAuth client not found"
- Make sure you created the Android OAuth client in Step 5d
- The package name and SHA-1 must match exactly

---

## What's Next?

After Firebase is set up:
1. Implement Google Sign-In functionality
2. Test authentication flow
3. Build the Home screen
4. Add partner pairing

---

## Security Rules (For Later)

Once you're ready to add proper security rules to your Realtime Database:

1. Go to Firebase Console → Realtime Database → Rules
2. Replace with:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && (auth.uid === $userId || data.child('partnerId').val() === auth.uid)",
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    "pairingCodes": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"
      }
    },
    "sessions": {
      "$sessionId": {
        ".read": "auth != null && (data.child('partner1Id').val() === auth.uid || data.child('partner2Id').val() === auth.uid)",
        ".write": "auth != null && (data.child('partner1Id').val() === auth.uid || data.child('partner2Id').val() === auth.uid || !data.exists())"
      }
    },
    "presence": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

3. Click "Publish"

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)

---

**Questions?** Refer to the main documentation in the parent directory or check the troubleshooting section above.

Good luck! 🚀
