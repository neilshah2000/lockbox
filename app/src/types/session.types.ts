// Session-related TypeScript types

export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Violation {
  id: string;
  timestamp: number;
  duration: number; // seconds outside app
  returned: boolean;
}

export interface Session {
  id: string;
  partner1Id: string;
  partner2Id: string;
  duration: number; // in minutes
  startTime: number | null;
  endTime: number | null;
  status: SessionStatus;
  partner1Accepted: boolean;
  partner2Accepted: boolean;
  createdAt: number;
  violations: {
    partner1: Record<string, Violation>;
    partner2: Record<string, Violation>;
  };
}

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalMinutes: number;
  successRate: number; // percentage
  currentStreak: number; // days
  longestStreak: number; // days
  totalViolations: number;
}
