// User-related TypeScript types

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  partnerId: string | null;
  fcmToken: string | null;
  createdAt: number;
  lastOnline: number;
}

export interface Partner {
  id: string;
  displayName: string;
  photoURL: string | null;
  online: boolean;
  lastSeen: number;
}

export interface PairingCode {
  code: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface Presence {
  online: boolean;
  lastSeen: number;
}
