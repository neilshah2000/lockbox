# Lockbox - Phase Deliverables

This document outlines what features and functionality will be available at the end of each development phase.

---

## Phase 1: Project Setup & Authentication

**Timeline:** Week 1 (2-4 hours of focused work)

### Working Features ✅

1. **Complete Authentication System (Google Sign-In)**
   - Login screen with "Sign in with Google" button
   - Google account picker integration
   - Auto-create user profile on first sign-in
   - Session persistence (users stay logged in after closing app)
   - Error handling for sign-in failures

2. **Basic Navigation**
   - Navigate to home screen after successful Google sign-in
   - Logout functionality
   - Authentication state management

3. **Simple Home Screen**
   - Displays welcome message with user's Google display name
   - Profile picture from Google account
   - Logout button
   - Placeholder UI for partner features (coming in Phase 2)
   - Basic styling and layout

### Technical Setup ✅

- Expo project initialized with TypeScript
- Firebase project created and configured
- Firebase Authentication enabled (Google Sign-In provider)
- Google Sign-In configured for Android
- Firebase SDK installed and connected
- Expo AuthSession or Google Sign-In library integrated
- Development environment configured
- Project folder structure created (`/src`, `/components`, `/services`, etc.)
- Basic constants (colors, config)
- Navigation structure in place

### What You Can Test

- ✅ Tap "Sign in with Google" button
- ✅ Select Google account from picker
- ✅ Successfully sign in and navigate to home screen
- ✅ See your Google display name and profile picture
- ✅ Logout and sign in again
- ✅ App remembers authentication state (stays logged in after restart)
- ✅ See appropriate error messages if sign-in fails

### UI Mockup

```
┌─────────────────────────┐
│     Login Screen        │
│                         │
│       🔒 Lockbox        │
│                         │
│   Connect without       │
│     distractions        │
│                         │
│  ┌───────────────────┐  │
│  │  🔵 Sign in with  │  │
│  │     Google        │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
         ↓ (after login)
┌─────────────────────────┐
│     Home Screen         │
│                         │
│  👤 Welcome, Sarah!     │
│                         │
│  Partner: Not paired    │
│  (Phase 2 feature)      │
│                         │
│  [Logout]               │
└─────────────────────────┘
```

---

## Phase 2: Partner Pairing & Lock Sessions

**Timeline:** Week 2

### Working Features ✅

1. **Partner Pairing System**
   - Generate unique 6-digit pairing code
   - Enter partner's code to pair
   - View paired partner information
   - Real-time status (online/offline)
   - Unpair functionality (with confirmation)

2. **Basic Lock Session**
   - Select session duration (30min, 1hr, 2hr, custom)
   - Send session request to partner
   - Accept/decline session requests
   - Countdown timer during active session
   - Both partners see synchronized timer
   - Complete session successfully
   - Cancel session (both must agree)

3. **Enhanced Home Screen**
   - Shows partner pairing status
   - Displays partner's online status
   - "Start Session" button (when paired)
   - Shows active session if one is running

### Technical Additions

- Firebase Realtime Database configured
- Database security rules implemented
- Real-time data synchronization
- Pairing service logic
- Session service logic
- Custom hooks: `usePartner()`, `useSession()`
- Timer component
- Session status UI components

### What You Can Test

- ✅ Generate a pairing code
- ✅ Pair with another account using the code
- ✅ See partner's online/offline status in real-time
- ✅ Start a lock session (both devices)
- ✅ Watch synchronized countdown timer
- ✅ Complete a session successfully
- ✅ Cancel a session (requires both to agree)
- ✅ Unpair from partner

### UI Mockup

```
┌─────────────────────────┐
│     Home Screen         │
│                         │
│  👥 Partner: Sarah      │
│  🟢 Online              │
│                         │
│  [Start Session]        │
│  [View History]         │
│  [Settings]             │
└─────────────────────────┘
         ↓ (session started)
┌─────────────────────────┐
│   Active Session        │
│                         │
│      ⏱️ 42:18           │
│    Stay Connected!      │
│                         │
│  You: No violations     │
│  Sarah: No violations   │
│                         │
│  [Request Cancel]       │
└─────────────────────────┘
```

---

## Phase 3: Accountability & Monitoring

**Timeline:** Week 3

### Working Features ✅

1. **Phone Usage Detection**
   - Monitor when user leaves the app
   - Track duration of time outside app
   - Record violations during session
   - Handle app state changes (background/foreground)

2. **Push Notifications**
   - Send notification to partner when phone is used
   - Notification shows partner name and usage duration
   - Sound and vibration alerts
   - Notification history
   - Configure notification preferences

3. **Violation Tracking**
   - Display violations in real-time during session
   - Show violation count for each partner
   - Show total time outside app
   - Violation details in session summary

### Technical Additions

- Firebase Cloud Messaging configured
- Push notification permissions handling
- App state monitoring (`AppState` API)
- Background tracking setup
- Notification service
- FCM token management
- Custom hook: `useAppState()`

### What You Can Test

- ✅ Start a session and leave the app
- ✅ Partner receives push notification
- ✅ See violation recorded in session
- ✅ View violation details (timestamp, duration)
- ✅ Test on both Android and iOS (important for this phase!)
- ✅ Configure notification settings

### Platform Testing Note

⚠️ **This phase requires testing on BOTH Android and iOS** due to platform differences in:
- Background permissions
- App state detection
- Push notification handling

---

## Phase 4: UI/UX Polish & History

**Timeline:** Week 4

### Working Features ✅

1. **Session History**
   - View all past sessions
   - Filter by date range
   - Session details (duration, violations, completion status)
   - Export history (optional)

2. **Statistics Dashboard**
   - Total time locked together
   - Streak counter (consecutive days)
   - Success rate percentage
   - Weekly/monthly insights
   - Visual charts and graphs

3. **Polished UI/UX**
   - Consistent color scheme and branding
   - Smooth animations and transitions
   - Celebration animations on session completion
   - Encouraging messages during sessions
   - Onboarding flow for new users
   - Empty states and loading indicators
   - Error handling with user-friendly messages

4. **Settings Screen**
   - Profile management
   - Notification preferences
   - Default session duration
   - Account settings
   - About/Help section

### Technical Additions

- Session history queries
- Statistics calculations
- Chart library integration (Victory Native or similar)
- Animation library (Reanimated or Animated API)
- Onboarding flow with AsyncStorage
- Polish all UI components
- Comprehensive error handling

### What You Can Test

- ✅ View complete session history
- ✅ See accurate statistics and insights
- ✅ Experience smooth animations
- ✅ See celebration when completing session
- ✅ Go through onboarding flow
- ✅ Customize settings
- ✅ Test all edge cases and error scenarios

### UI Mockup

```
┌─────────────────────────┐
│   History Screen        │
│                         │
│  📊 Total: 12.5 hours   │
│  🔥 Streak: 5 days      │
│  ✅ Success: 85%        │
│                         │
│  Recent Sessions:       │
│  ─────────────────      │
│  Apr 6 • 1hr • ✅       │
│  Apr 5 • 1hr • ⚠️ 1     │
│  Apr 4 • 30m • ✅       │
└─────────────────────────┘
```

---

## Phase 5: Additional Features (Optional Enhancement)

**Timeline:** Post-launch / Ongoing

### Potential Features

1. **In-App Activities**
   - Conversation prompts
   - Question cards for couples
   - Gratitude prompts

2. **Extended Integration**
   - Apple Watch / Wear OS companion
   - Widget support
   - Shortcuts integration

3. **Social Features**
   - Anonymous leaderboards
   - Achievements and badges
   - Share milestones

4. **Premium Features**
   - Longer session durations
   - Advanced analytics
   - Custom themes
   - Ad-free experience

5. **Enhanced Monitoring**
   - Integration with Do Not Disturb
   - Screen time API integration (iOS)
   - More granular usage tracking

---

## Summary

| Phase | Duration | Key Features | Testable? |
|-------|----------|--------------|-----------|
| 1 | Week 1 | Authentication, Basic Navigation | ✅ Yes - Android only fine |
| 2 | Week 2 | Pairing, Lock Sessions, Timer | ✅ Yes - Android only fine |
| 3 | Week 3 | Monitoring, Notifications | ✅ Yes - **Need both platforms** |
| 4 | Week 4 | History, Stats, Polish | ✅ Yes - Both platforms recommended |
| 5 | Future | Advanced features | Optional |

---

## Notes

- Each phase builds on the previous one
- Features are functional and testable at the end of each phase
- Phase 1-2 can be developed and tested on Android only
- Phase 3+ requires testing on both Android and iOS
- Timeline estimates assume 2-4 hours of focused work per phase
