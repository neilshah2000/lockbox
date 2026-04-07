# Lockbox - Firebase Data Model

This document defines the complete data structure for the Lockbox app using Firebase Realtime Database.

---

## Overview

Firebase Realtime Database is a NoSQL database that stores data as JSON. Data is organized in a tree structure with nodes and children.

### Key Principles
- Data is denormalized (duplicated for faster reads)
- Structure should be flat when possible
- Design for the queries you'll make
- Real-time listeners watch specific paths

---

## Database Structure

```
lockbox-db/
├── users/
├── pairingCodes/
├── sessions/
└── presence/
```

---

## 1. Users Node

Stores user profile information and partner relationship.

### Structure
```json
users/
  {userId}/               // Google Auth UID
    email: string
    displayName: string
    photoURL: string
    partnerId: string | null
    fcmToken: string
    createdAt: timestamp
    lastOnline: timestamp
```

### Example Data
```json
{
  "users": {
    "google_abc123": {
      "email": "sarah@gmail.com",
      "displayName": "Sarah Johnson",
      "photoURL": "https://lh3.googleusercontent.com/a/...",
      "partnerId": "google_xyz789",
      "fcmToken": "fcm_device_token_abc123",
      "createdAt": 1712520000000,
      "lastOnline": 1712523600000
    },
    "google_xyz789": {
      "email": "john@gmail.com",
      "displayName": "John Smith",
      "photoURL": "https://lh3.googleusercontent.com/a/...",
      "partnerId": "google_abc123",
      "fcmToken": "fcm_device_token_xyz789",
      "createdAt": 1712520100000,
      "lastOnline": 1712523650000
    }
  }
}
```

### Fields Description
- `userId` (key): Google Authentication UID
- `email`: User's email from Google account
- `displayName`: User's display name from Google
- `photoURL`: Profile picture URL from Google
- `partnerId`: Reference to paired partner's userId (null if not paired)
- `fcmToken`: Firebase Cloud Messaging token for push notifications
- `createdAt`: Timestamp when account was created
- `lastOnline`: Timestamp of last activity

### Security Rules
```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && (auth.uid === $userId || data.child('partnerId').val() === auth.uid)",
        ".write": "auth != null && auth.uid === $userId",
        "partnerId": {
          ".validate": "newData.isString() || newData.val() === null"
        },
        "email": {
          ".validate": "newData.isString()"
        }
      }
    }
  }
}
```

### Common Queries
```javascript
// Get current user
const userRef = ref(db, `users/${userId}`);
onValue(userRef, (snapshot) => {
  const userData = snapshot.val();
});

// Get partner data
const partnerRef = ref(db, `users/${partnerId}`);

// Update FCM token
await update(ref(db, `users/${userId}`), {
  fcmToken: newToken,
  lastOnline: Date.now()
});
```

---

## 2. Pairing Codes Node

Temporary codes for partner pairing. Codes expire after 1 hour.

### Structure
```json
pairingCodes/
  {code}/                 // 6-digit alphanumeric code
    userId: string
    createdAt: timestamp
    expiresAt: timestamp
```

### Example Data
```json
{
  "pairingCodes": {
    "ABC123": {
      "userId": "google_abc123",
      "createdAt": 1712523600000,
      "expiresAt": 1712527200000
    },
    "XYZ789": {
      "userId": "google_xyz789",
      "createdAt": 1712523700000,
      "expiresAt": 1712527300000
    }
  }
}
```

### Fields Description
- `code` (key): 6-character alphanumeric code (e.g., "ABC123")
- `userId`: ID of user who generated this code
- `createdAt`: Timestamp when code was created
- `expiresAt`: Timestamp when code expires (createdAt + 1 hour)

### Security Rules
```json
{
  "rules": {
    "pairingCodes": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)",
        ".validate": "newData.hasChildren(['userId', 'createdAt', 'expiresAt'])"
      }
    }
  }
}
```

### Common Queries
```javascript
// Generate new pairing code
const code = generateRandomCode(); // "ABC123"
await set(ref(db, `pairingCodes/${code}`), {
  userId: currentUserId,
  createdAt: Date.now(),
  expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
});

// Lookup pairing code
const codeRef = ref(db, `pairingCodes/${enteredCode}`);
const snapshot = await get(codeRef);
if (snapshot.exists()) {
  const codeData = snapshot.val();
  // Check if expired
  if (Date.now() < codeData.expiresAt) {
    // Valid code, pair with codeData.userId
  }
}

// Delete pairing code after use
await remove(ref(db, `pairingCodes/${code}`));
```

### Cleanup Strategy
- Delete code after successful pairing
- Run periodic cleanup function to remove expired codes
- Or let them expire naturally (check expiresAt on read)

---

## 3. Sessions Node

Stores all lock sessions (past and present).

### Structure
```json
sessions/
  {sessionId}/            // Auto-generated unique ID
    partner1Id: string
    partner2Id: string
    duration: number      // in minutes
    startTime: timestamp | null
    endTime: timestamp | null
    status: string        // "pending" | "active" | "completed" | "cancelled"
    partner1Accepted: boolean
    partner2Accepted: boolean
    createdAt: timestamp
    violations/
      partner1/
        {violationId}/
          timestamp: timestamp
          duration: number  // seconds outside app
          returned: boolean
      partner2/
        {violationId}/
          timestamp: timestamp
          duration: number
          returned: boolean
```

### Example Data
```json
{
  "sessions": {
    "session_001": {
      "partner1Id": "google_abc123",
      "partner2Id": "google_xyz789",
      "duration": 60,
      "startTime": 1712523600000,
      "endTime": 1712527200000,
      "status": "active",
      "partner1Accepted": true,
      "partner2Accepted": true,
      "createdAt": 1712523500000,
      "violations": {
        "partner1": {
          "violation_001": {
            "timestamp": 1712524000000,
            "duration": 30,
            "returned": true
          }
        },
        "partner2": {
          "violation_001": {
            "timestamp": 1712525000000,
            "duration": 45,
            "returned": true
          }
        }
      }
    },
    "session_002": {
      "partner1Id": "google_abc123",
      "partner2Id": "google_xyz789",
      "duration": 30,
      "startTime": null,
      "endTime": null,
      "status": "pending",
      "partner1Accepted": true,
      "partner2Accepted": false,
      "createdAt": 1712527300000,
      "violations": {}
    }
  }
}
```

### Fields Description

**Session Fields:**
- `sessionId` (key): Unique session identifier (auto-generated)
- `partner1Id`: User ID of first partner
- `partner2Id`: User ID of second partner
- `duration`: Session length in minutes (30, 60, 120, etc.)
- `startTime`: Timestamp when session actually started (null if pending)
- `endTime`: Timestamp when session should end (null if pending)
- `status`: Current session state
  - `"pending"`: Waiting for both partners to accept
  - `"active"`: Session in progress
  - `"completed"`: Session finished successfully
  - `"cancelled"`: Session was cancelled before completion
- `partner1Accepted`: Whether partner 1 accepted the session
- `partner2Accepted`: Whether partner 2 accepted the session
- `createdAt`: Timestamp when session was created

**Violation Fields:**
- `violationId` (key): Unique violation identifier
- `timestamp`: When the user left the app
- `duration`: How long they were outside the app (in seconds)
- `returned`: Whether they returned to the app (true) or session ended while away (false)

### Session Status Flow
```
pending → active → completed
              ↓
          cancelled
```

### Security Rules
```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": "auth != null && (data.child('partner1Id').val() === auth.uid || data.child('partner2Id').val() === auth.uid)",
        ".write": "auth != null && (data.child('partner1Id').val() === auth.uid || data.child('partner2Id').val() === auth.uid || !data.exists())",
        "violations": {
          "partner1": {
            ".write": "auth != null && root.child('sessions').child($sessionId).child('partner1Id').val() === auth.uid"
          },
          "partner2": {
            ".write": "auth != null && root.child('sessions').child($sessionId).child('partner2Id').val() === auth.uid"
          }
        }
      }
    }
  }
}
```

### Common Queries
```javascript
// Create new session
const newSessionRef = push(ref(db, 'sessions'));
await set(newSessionRef, {
  partner1Id: currentUserId,
  partner2Id: partnerId,
  duration: 60,
  startTime: null,
  endTime: null,
  status: 'pending',
  partner1Accepted: true,
  partner2Accepted: false,
  createdAt: Date.now(),
  violations: {}
});

// Accept session
await update(ref(db, `sessions/${sessionId}`), {
  partner2Accepted: true,
  status: 'active',
  startTime: Date.now(),
  endTime: Date.now() + (duration * 60 * 1000)
});

// Add violation
const violationRef = push(ref(db, `sessions/${sessionId}/violations/${partnerKey}`));
await set(violationRef, {
  timestamp: Date.now(),
  duration: secondsOutside,
  returned: true
});

// Get active session for user
const sessionsRef = ref(db, 'sessions');
const activeQuery = query(
  sessionsRef,
  orderByChild('status'),
  equalTo('active')
);
// Filter client-side for current user's sessions

// Get session history
const completedQuery = query(
  sessionsRef,
  orderByChild('status'),
  equalTo('completed')
);
```

---

## 4. Presence Node

Tracks online/offline status of users in real-time.

### Structure
```json
presence/
  {userId}/
    online: boolean
    lastSeen: timestamp
```

### Example Data
```json
{
  "presence": {
    "google_abc123": {
      "online": true,
      "lastSeen": 1712523600000
    },
    "google_xyz789": {
      "online": false,
      "lastSeen": 1712523400000
    }
  }
}
```

### Fields Description
- `userId` (key): User ID
- `online`: Current online status (true/false)
- `lastSeen`: Timestamp of last activity

### Firebase Presence Detection
Firebase provides built-in presence detection using `onDisconnect()`:

```javascript
// Set user online
const presenceRef = ref(db, `presence/${userId}`);
await set(presenceRef, {
  online: true,
  lastSeen: Date.now()
});

// Set offline when disconnected
onDisconnect(presenceRef).set({
  online: false,
  lastSeen: serverTimestamp()
});
```

### Security Rules
```json
{
  "rules": {
    "presence": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

### Common Queries
```javascript
// Listen to partner's presence
const partnerPresenceRef = ref(db, `presence/${partnerId}`);
onValue(partnerPresenceRef, (snapshot) => {
  const presence = snapshot.val();
  if (presence?.online) {
    console.log('Partner is online');
  } else {
    console.log('Partner was last seen:', new Date(presence?.lastSeen));
  }
});
```

---

## Data Relationships

### User ↔ Partner
```
User A (partnerId: "userB") ←→ User B (partnerId: "userA")
```
Bidirectional relationship stored on both user nodes.

### User → Sessions
```
User A ─→ Sessions (where partner1Id === "userA" OR partner2Id === "userA")
```
Query sessions where user is either partner1 or partner2.

### Pairing Code → User
```
Pairing Code "ABC123" → User A
```
Temporary link, deleted after pairing.

---

## Indexes

Firebase Realtime Database requires indexes for complex queries.

### Required Indexes (firebase.json)
```json
{
  "database": {
    "rules": "database.rules.json"
  },
  "indexes": [
    {
      "rules": {
        "sessions": {
          ".indexOn": ["status", "partner1Id", "partner2Id", "createdAt"]
        }
      }
    }
  ]
}
```

---

## Statistics & Aggregations

For Phase 4 statistics, we'll calculate on the client:

### Total Time Together
- Query all completed sessions
- Sum up `duration` for each session

### Streak Counter
- Query sessions by `createdAt`
- Check for consecutive days with at least one completed session

### Success Rate
- Count completed sessions vs. cancelled sessions
- Calculate percentage

### Example Calculation (Client-side)
```javascript
const sessionsRef = ref(db, 'sessions');
const sessionsSnapshot = await get(sessionsRef);
const sessions = sessionsSnapshot.val();

let totalMinutes = 0;
let completedCount = 0;
let cancelledCount = 0;

Object.values(sessions).forEach(session => {
  if (session.status === 'completed') {
    totalMinutes += session.duration;
    completedCount++;
  } else if (session.status === 'cancelled') {
    cancelledCount++;
  }
});

const successRate = (completedCount / (completedCount + cancelledCount)) * 100;
```

---

## Data Size Considerations

### Storage Estimates (per couple)
- User profiles: ~1 KB each = 2 KB
- Sessions (100 sessions): ~50 KB
- Violations (avg 2 per session): ~20 KB
- Presence: ~0.5 KB
- **Total: ~75 KB per couple**

Firebase Realtime Database free tier:
- 1 GB stored data
- 10 GB/month downloaded
- Enough for ~13,000 couples

---

## Migration Strategy

If structure needs to change:

1. **Add new fields** - Just start writing them (backwards compatible)
2. **Rename fields** - Write to both old and new, then migrate
3. **Restructure nodes** - Write Firebase Cloud Function to migrate data

---

## Backup Strategy

- Firebase automatically backs up data
- Export data periodically using Firebase Console
- Consider Cloud Functions for scheduled exports

---

## Summary

This data model provides:
- ✅ Real-time sync between partners
- ✅ Efficient queries for sessions and history
- ✅ Security rules to protect user data
- ✅ Scalable structure for future features
- ✅ Simple enough for Phase 1 implementation

All services in `/src/services/` will use this structure as reference.
