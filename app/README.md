# Lockbox Mobile App

React Native mobile app for couples to lock their phones away and connect without distractions.

## Project Structure

```
app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── services/        # Business logic & Firebase
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context providers
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── constants/       # App constants (colors, config)
│   └── navigation/      # Navigation setup
├── assets/              # Images, fonts, icons
├── App.tsx              # Root component
└── package.json         # Dependencies
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android device or emulator with Expo Go app installed

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and fill in your Firebase credentials (see Firebase Setup section below)

## Running the App

### Option 1: Expo Go (Recommended for Development)

1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **On your Android phone:**
   - Install "Expo Go" from Google Play Store
   - Scan the QR code shown in the terminal
   - App will load on your device

3. **Or use Android Emulator:**
   - Press `a` in the terminal to open in Android emulator
   - Make sure Android Studio and emulator are set up

### Option 2: Development Build (Required for Phase 3+)

For features like background tracking and push notifications, you'll need a development build:

```bash
npx expo install expo-dev-client
npx eas build --profile development --platform android
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "lockbox" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Google Sign-In**:
   - Click on "Google" provider
   - Toggle "Enable"
   - Enter support email
   - Save

### 3. Set up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose location (us-central1 recommended)
4. Start in **Test Mode** (we'll add security rules later)
5. Click "Enable"

### 4. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>` to add a web app
4. Register app (name: "lockbox-web-config")
5. Copy the configuration values to your `.env` file:
   ```
   FIREBASE_API_KEY=...
   FIREBASE_AUTH_DOMAIN=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_STORAGE_BUCKET=...
   FIREBASE_MESSAGING_SENDER_ID=...
   FIREBASE_APP_ID=...
   FIREBASE_DATABASE_URL=...
   ```

### 5. Configure Google Sign-In for Android

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Create **OAuth 2.0 Client ID**:
   - Application type: Android
   - Package name: Get from `app.json` (e.g., `com.yourusername.lockbox`)
   - SHA-1: Run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
5. Copy the Client ID to `.env`:
   ```
   GOOGLE_ANDROID_CLIENT_ID=...
   ```

## Development

### Phase 1 Status

✅ Project setup complete
✅ Folder structure created
✅ TypeScript types defined
✅ Constants configured
✅ Login screen UI created
⏳ Firebase authentication pending
⏳ Google Sign-In integration pending

### Hot Reload

The app supports hot reload - changes to your code will automatically update on the device/emulator.

### Debugging

- **Console logs:** View in terminal where `expo start` is running
- **React DevTools:** Press `d` in terminal to open
- **Reload app:** Shake device or press `r` in terminal

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser (limited functionality)

## Troubleshooting

### "Expo Go" not connecting
- Make sure your phone and computer are on the same Wi-Fi network
- Try entering the URL manually in Expo Go

### Firebase errors
- Check that all environment variables in `.env` are set correctly
- Make sure Firebase services are enabled in Firebase Console

### Module not found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear cache: `npx expo start --clear`

## Next Steps

1. **Set up Firebase** (follow Firebase Setup above)
2. **Implement Google Sign-In** (Phase 1, Task 3)
3. **Test authentication flow**
4. **Build home screen**

See `../PHASE_1_DEVELOPMENT_PLAN.md` for complete roadmap.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation
- **Backend:** Firebase (Auth, Realtime Database, Cloud Messaging)
- **Authentication:** Google Sign-In

## Documentation

- [Phase 1 Development Plan](../PHASE_1_DEVELOPMENT_PLAN.md)
- [Phase Deliverables](../PHASE_DELIVERABLES.md)
- [Project Structure](../PROJECT_STRUCTURE.md)
- [Data Model](../DATA_MODEL.md)
- [Competitive Analysis](../COMPETITIVE_ANALYSIS.md)

## Support

For issues or questions, refer to the documentation files in the parent directory.
