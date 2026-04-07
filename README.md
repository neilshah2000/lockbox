# Lockbox

A mobile app for couples to lock their phones away and connect without distractions.

## Overview

Lockbox helps couples be more present together by creating synchronized "lock" sessions where both partners put their phones away. The app uses an honor system with accountability - if either partner uses their phone during a session, the other is notified in real-time.

## Key Features

- **Synchronized Sessions:** Both phones lock at the same time
- **Real-time Accountability:** Instant notifications when partner uses phone
- **Google Sign-In:** Simple one-tap authentication
- **Couple-Centric:** Built specifically for two people to use together
- **Progress Tracking:** See session history, streaks, and statistics together

## Repository Structure

```
lockbox/
├── app/                              # Mobile app code
│   ├── src/                          # Source code
│   │   ├── components/               # UI components
│   │   ├── screens/                  # Screen components
│   │   ├── services/                 # Firebase & business logic
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # State management
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # Helper functions
│   │   └── constants/                # Colors, config
│   ├── assets/                       # Images, fonts
│   └── README.md                     # App-specific setup guide
│
├── PHASE_1_DEVELOPMENT_PLAN.md       # Overall development plan
├── PHASE_DELIVERABLES.md             # Features per phase
├── PROJECT_STRUCTURE.md              # Code organization guide
├── DATA_MODEL.md                     # Firebase data structure
├── COMPETITIVE_ANALYSIS.md           # Market research
└── README.md                         # This file
```

## Documentation

### For Developers

1. **[Phase 1 Development Plan](PHASE_1_DEVELOPMENT_PLAN.md)** - Complete development roadmap
2. **[Phase Deliverables](PHASE_DELIVERABLES.md)** - What you'll have at each phase
3. **[Project Structure](PROJECT_STRUCTURE.md)** - How the code is organized
4. **[Data Model](DATA_MODEL.md)** - Firebase database structure
5. **[App README](app/README.md)** - How to run the app

### For Product/Business

1. **[Competitive Analysis](COMPETITIVE_ANALYSIS.md)** - Market research and positioning

## Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- Android device with Expo Go app

### Setup

1. **Navigate to app directory:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start development server:**
   ```bash
   npx expo start
   ```

5. **Scan QR code** with Expo Go app on your Android phone

For detailed setup instructions, see [app/README.md](app/README.md)

## Development Status

### Phase 1: Project Setup & Authentication (In Progress)

- ✅ Project initialized with Expo & TypeScript
- ✅ Folder structure created
- ✅ TypeScript types defined
- ✅ Login screen UI built
- ⏳ Firebase setup (next step)
- ⏳ Google Sign-In integration
- ⏳ Authentication flow
- ⏳ Home screen

### Upcoming Phases

- **Phase 2:** Partner pairing and lock sessions
- **Phase 3:** App monitoring and notifications
- **Phase 4:** UI polish and session history
- **Phase 5:** Advanced features (optional)

See [PHASE_DELIVERABLES.md](PHASE_DELIVERABLES.md) for complete breakdown.

## Tech Stack

- **Frontend:** React Native with Expo
- **Language:** TypeScript
- **Backend:** Firebase (Realtime Database, Authentication, Cloud Messaging)
- **Platform:** Android (iOS coming later)
- **Authentication:** Google Sign-In

## Project Goals

1. **Help couples be more present** - Reduce phone distractions during quality time
2. **Build with accountability** - Honor system with transparency, not control
3. **Create together moments** - Synchronized sessions for shared experiences
4. **Track progress** - Celebrate milestones and streaks as a couple

## Design Principles

- **Couple-centric:** Designed for two people as a unit
- **Honor-based:** Respectful, not controlling
- **Real-time sync:** Both partners always see the same state
- **Positive reinforcement:** Celebrate success, don't punish failures
- **Simple & focused:** Do one thing well

## Target Audience

- Tech-aware couples (ages 25-35)
- Android users initially
- Recognize phone usage affecting their relationship
- Want accountability without feeling controlled

## Unique Value Proposition

Lockbox is the **only app** that combines:
- Synchronized sessions between two specific partners
- Real-time accountability notifications
- Couple-centric design (not just individual screen time control)
- Honor system with transparency

See [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md) for market positioning.

## Contributing

This is currently a solo project for learning and development. Phase 1 is in progress.

## Roadmap

- **Week 1:** Authentication and basic navigation ⏳
- **Week 2:** Partner pairing and lock sessions
- **Week 3:** App monitoring and notifications
- **Week 4:** UI polish and statistics
- **Future:** iOS support, advanced features

## Questions?

Refer to the documentation files above, especially:
- [app/README.md](app/README.md) for running the app
- [PHASE_1_DEVELOPMENT_PLAN.md](PHASE_1_DEVELOPMENT_PLAN.md) for the full plan
- [DATA_MODEL.md](DATA_MODEL.md) for Firebase structure

---

**Built with ❤️ for couples who want to be more present together**
