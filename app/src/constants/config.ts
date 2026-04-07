// App configuration constants

export const config = {
  // App info
  appName: 'Lockbox',
  appVersion: '1.0.0',

  // Session durations (in minutes)
  sessionDurations: [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: 'Custom', value: 0 }, // 0 means custom input
  ],

  // Default session duration
  defaultSessionDuration: 60, // 1 hour

  // Pairing code settings
  pairingCodeLength: 6,
  pairingCodeExpiry: 60 * 60 * 1000, // 1 hour in milliseconds

  // Violation tracking
  minViolationDuration: 10, // seconds - minimum time to count as violation

  // Update intervals
  presenceUpdateInterval: 30000, // 30 seconds
  sessionTimerUpdateInterval: 1000, // 1 second

  // Firebase collection names (for reference)
  collections: {
    users: 'users',
    sessions: 'sessions',
    pairingCodes: 'pairingCodes',
    presence: 'presence',
  },
};

export default config;
