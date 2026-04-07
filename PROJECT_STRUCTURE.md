# Lockbox - Project Structure

This document outlines the folder and file structure for the Lockbox mobile app.

---

## Directory Structure

```
lockbox/
├── app/                          # App screens (Expo Router structure)
│   ├── (auth)/                   # Auth-related screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (app)/                    # Main app screens (after login)
│   │   ├── home.tsx
│   │   ├── session.tsx
│   │   ├── history.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Timer.tsx
│   │   ├── StatusCard.tsx
│   │   ├── SessionCard.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── screens/                  # Screen components (if not using Expo Router)
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SessionScreen.tsx
│   │   └── ...
│   │
│   ├── services/                 # Business logic & API calls
│   │   ├── firebase.ts           # Firebase config
│   │   ├── auth.service.ts       # Authentication functions
│   │   ├── pairing.service.ts    # Partner pairing logic
│   │   ├── session.service.ts    # Lock session logic
│   │   └── notification.service.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication state
│   │   ├── usePartner.ts         # Partner data
│   │   ├── useSession.ts         # Active session state
│   │   └── useAppState.ts        # App state monitoring
│   │
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── PartnerContext.tsx
│   │   └── SessionContext.tsx
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── user.types.ts
│   │   ├── session.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── time.utils.ts         # Time formatting
│   │   ├── validation.utils.ts   # Form validation
│   │   └── storage.utils.ts      # AsyncStorage helpers
│   │
│   ├── constants/                # App constants
│   │   ├── colors.ts             # Color palette
│   │   ├── config.ts             # App configuration
│   │   └── strings.ts            # Text strings
│   │
│   └── navigation/               # Navigation setup (if using React Navigation)
│       ├── AppNavigator.tsx
│       └── AuthNavigator.tsx
│
├── assets/                       # Images, fonts, etc.
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── .expo/                        # Expo cache (auto-generated)
├── node_modules/                 # Dependencies (auto-generated)
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── babel.config.js               # Babel config
├── .gitignore
├── .env                          # Environment variables (Firebase keys)
├── DEVELOPMENT_PLAN.md           # Development plan
└── PROJECT_STRUCTURE.md          # This file
```

---

## Folder Descriptions

### `/app` or `/src/screens`
Contains all the screens/pages of the application.

**Using Expo Router (Recommended for beginners):**
- File-based routing similar to Next.js
- `(auth)/` - Authentication screens (login, signup, etc.)
- `(app)/` - Main app screens (home, session, history, settings)
- `_layout.tsx` - Root layout with providers
- `index.tsx` - Entry point that handles initial routing

**Alternative: React Navigation:**
- Use `/src/screens` folder with manual route configuration
- More established but requires more setup

---

### `/src/components`
Reusable UI components used across multiple screens.

**Examples:**
- `Button.tsx` - Custom button component with consistent styling
- `Timer.tsx` - Countdown timer display
- `StatusCard.tsx` - Shows partner status (online/offline)
- `SessionCard.tsx` - Displays session information in history
- `LoadingSpinner.tsx` - Loading indicator

---

### `/src/services`
Business logic and external API interactions. Keeps screens clean and focused on UI.

**Files:**
- `firebase.ts` - Firebase initialization and configuration
- `auth.service.ts` - Login, signup, logout, password reset
- `pairing.service.ts` - Generate codes, pair/unpair partners
- `session.service.ts` - Create, start, end, cancel sessions
- `notification.service.ts` - Send push notifications, handle FCM tokens

---

### `/src/hooks`
Custom React hooks for reusable stateful logic.

**Files:**
- `useAuth.ts` - Current user state, login/logout methods
- `usePartner.ts` - Partner data, pairing status
- `useSession.ts` - Active session state, start/end methods
- `useAppState.ts` - Monitor app foreground/background state

**Example usage:**
```typescript
const { user, login, logout } = useAuth();
const { partner, isPaired } = usePartner();
const { activeSession, startSession } = useSession();
```

---

### `/src/context`
React Context providers for global state management.

**Files:**
- `AuthContext.tsx` - User authentication state
- `PartnerContext.tsx` - Partner information and pairing state
- `SessionContext.tsx` - Active session data

**Purpose:** Share data across the app without prop drilling

---

### `/src/types`
TypeScript type definitions and interfaces.

**Files:**
- `user.types.ts` - User, Partner interfaces
- `session.types.ts` - Session, SessionStatus, Violation interfaces
- `navigation.types.ts` - Navigation route parameters

**Example:**
```typescript
// session.types.ts
export interface Session {
  id: string;
  partner1Id: string;
  partner2Id: string;
  duration: number;
  startTime: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}
```

---

### `/src/utils`
Utility functions and helpers.

**Files:**
- `time.utils.ts` - Format durations, timestamps
- `validation.utils.ts` - Email validation, form validation
- `storage.utils.ts` - AsyncStorage wrapper functions

---

### `/src/constants`
Application-wide constants and configuration.

**Files:**
- `colors.ts` - Color palette for consistent theming
- `config.ts` - App configuration (session durations, etc.)
- `strings.ts` - Text strings for easy localization later

**Example:**
```typescript
// colors.ts
export const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  background: '#F8F9FA',
  text: '#212529',
};
```

---

### `/src/navigation`
Navigation configuration (if using React Navigation instead of Expo Router).

**Files:**
- `AppNavigator.tsx` - Main app navigation stack
- `AuthNavigator.tsx` - Authentication flow navigation

---

### `/assets`
Static assets like images, fonts, and icons.

**Subfolders:**
- `images/` - Logo, illustrations, backgrounds
- `fonts/` - Custom fonts (if any)
- `icons/` - App icons and UI icons

---

## Configuration Files

### `app.json`
Expo configuration file - app name, icon, splash screen, permissions, etc.

### `package.json`
NPM dependencies and scripts

### `tsconfig.json`
TypeScript compiler configuration

### `babel.config.js`
Babel transpiler configuration for Expo

### `.env`
Environment variables (Firebase API keys, etc.)
**Important:** Add to `.gitignore` - never commit to version control

### `.gitignore`
Files and folders to exclude from Git (node_modules, .env, etc.)

---

## Navigation Approach Decision

### Option 1: Expo Router (Recommended)
- **Pros:** File-based routing, simpler for beginners, modern approach
- **Cons:** Newer (less Stack Overflow answers)
- **Structure:** Use `/app` folder as shown above

### Option 2: React Navigation
- **Pros:** More established, lots of documentation
- **Cons:** More boilerplate, manual route configuration
- **Structure:** Use `/src/screens` + `/src/navigation`

---

## Notes

- This structure follows React Native best practices
- Separation of concerns: UI, business logic, state management
- Scalable - easy to add new features
- TypeScript support throughout for type safety
- Clean architecture makes testing easier
