# Lockbox App - Development Plan

## Overview
Lockbox is a mobile app for couples to lock their phones away for a set period (e.g., 1 hour) to connect and interact without distractions. The app uses an honor system with accountability by notifying the partner if the phone is used during a lock session.

## Key Features
- Cross-platform (iOS & Android) using React Native with Expo
- Synchronized locking between partners
- Accountability notifications when phone is used
- Real-time status sync between devices
- Session history and statistics

---

## Phase 1: Project Setup & Core Infrastructure

### 1. Initialize React Native with Expo
- Use Expo managed workflow for easier development
- Set up TypeScript for type safety
- Configure development environment
- Install necessary dependencies

### 2. Set up Backend Services
- Firebase Authentication (Google Sign-In)
- Firebase Realtime Database (for live sync between partners)
- Firebase Cloud Messaging (for push notifications)
- Configure Firebase project
- Configure Google Sign-In for Android
- Set up security rules

---

## Phase 2: Core Features

### Authentication System
- Google Sign-In integration
- Login screen with "Sign in with Google" button
- Auto-create user profile on first sign-in
- Persistent login state
- Profile data from Google account (name, email, photo)

### Partner Pairing
- Generate unique pairing codes
- Partner invitation system
- View paired partner status
- Ability to unpair (with confirmation)
- Handle pairing requests/acceptance

### Lock Session
- Create new lock session (both partners must accept)
- Real-time countdown timer
- Session status sync between devices
- Cancel session (requires both partners' consent)
- Handle edge cases (app crash, phone restart, etc.)

---

## Phase 3: Accountability & Monitoring

### Phone Usage Detection
- Monitor app state changes (when user leaves the app)
- Track duration outside the app
- Request necessary background tracking permissions
- Handle different app states (background, inactive, active)

### Notifications
- Send push notification to partner when phone is used
- Notification shows: partner name, duration of usage
- Sound/vibration alerts
- Configure notification preferences
- Handle notification permissions

---

## Phase 4: UI/UX & Polish

### Screens
1. **Splash/Onboarding** - Welcome and app introduction
2. **Login/Signup** - Authentication screens
3. **Home** - Shows partner status, start session button
4. **Active Session** - Timer, usage stats, partner status
5. **Profile/Settings** - User settings and preferences
6. **Session History** - Past sessions and statistics

### Design Elements
- Warm, calm color scheme (promotes connection)
- Simple, distraction-free interface
- Encouraging messages during sessions
- Celebration animations when session completes
- Consistent typography and spacing

---

## Phase 5: Additional Features

### Statistics & History
- Total time locked together
- Streak counter (consecutive days)
- Success rate (sessions completed without interruptions)
- Weekly/monthly insights
- Visual charts and graphs

### Customization
- Custom session durations (30min, 1hr, 2hr, custom)
- Notification preferences
- Emergency contacts (always accessible)
- Theme options
- Sound/vibration settings

---

## Technical Stack

### Frontend
- **Framework**: React Native + Expo
- **Language**: JavaScript/TypeScript
- **Navigation**: React Navigation
- **UI Components**: React Native Paper or custom components
- **State Management**: React Context or Zustand
- **Forms**: React Hook Form

### Backend
- **Authentication**: Firebase Authentication
- **Database**: Firebase Realtime Database
- **Push Notifications**: Firebase Cloud Messaging
- **Storage**: Firebase Storage (for profile pictures, if needed)

### Development Tools
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Native Testing Library
- **Deployment**: EAS Build (Expo Application Services)

---

## Development Phases Timeline

### Week 1: Setup + Authentication (Tasks 1-4)
- Initialize Expo project
- Set up Firebase
- Build authentication flow
- Create basic navigation

### Week 2: Pairing + Basic Lock Session (Tasks 5-6)
- Implement partner pairing system
- Create lock session UI and timer
- Set up real-time database sync

### Week 3: Monitoring + Notifications (Tasks 7-8)
- Add app state monitoring
- Implement push notifications
- Handle accountability alerts

### Week 4: UI Polish + History (Tasks 9-10)
- Design and implement UI/UX
- Add session history and statistics
- Testing and bug fixes

---

## Data Model

### Users Collection
```
users/
  {userId}/
    email: string
    displayName: string
    partnerId: string | null
    createdAt: timestamp
    fcmToken: string (for push notifications)
```

### Pairing Codes Collection
```
pairingCodes/
  {code}/
    userId: string
    createdAt: timestamp
    expiresAt: timestamp
```

### Sessions Collection
```
sessions/
  {sessionId}/
    partner1Id: string
    partner2Id: string
    duration: number (in minutes)
    startTime: timestamp
    endTime: timestamp
    status: 'pending' | 'active' | 'completed' | 'cancelled'
    partner1Violations: [{timestamp, duration}]
    partner2Violations: [{timestamp, duration}]
```

---

## Security Considerations

- Implement Firebase Security Rules to ensure users can only access their own data
- Validate all inputs on both client and server
- Use HTTPS for all communications
- Encrypt sensitive data
- Handle authentication tokens securely
- Implement rate limiting for pairing code generation

---

## Future Enhancements (Post-Launch)

- In-app activities/conversation prompts during lock sessions
- Integration with device Do Not Disturb settings
- Apple Watch/Wear OS companion app
- Web dashboard for viewing statistics
- Social features (anonymous leaderboards)
- Gamification (achievements, badges)
- Premium features (longer sessions, advanced stats)
