import { ref, set, update, get, push, remove, serverTimestamp } from 'firebase/database';
import { database } from './firebase';
import { Session } from '../types/session.types';

export async function createSession(
  initiatorId: string,
  partnerId: string,
  durationMinutes: number
): Promise<string> {
  const newSessionRef = push(ref(database, 'sessions'));
  const sessionId = newSessionRef.key!;

  const session: Session = {
    id: sessionId,
    partner1Id: initiatorId,
    partner2Id: partnerId,
    duration: durationMinutes,
    startTime: null,
    endTime: null,
    status: 'pending',
    partner1Accepted: true,
    partner2Accepted: false,
    createdAt: Date.now(),
    violations: { partner1: {}, partner2: {} },
  };

  await set(newSessionRef, session);
  await set(ref(database, `users/${partnerId}/pendingSessionId`), sessionId);
  return sessionId;
}

export async function acceptSession(sessionId: string): Promise<void> {
  const sessionSnap = await get(ref(database, `sessions/${sessionId}`));
  if (!sessionSnap.exists()) throw new Error('Session not found');

  const session = sessionSnap.val() as Session;
  await update(ref(database, `sessions/${sessionId}`), {
    partner2Accepted: true,
    status: 'active',
    startTime: serverTimestamp(),
    endTime: null,
  });

  await update(ref(database, `users/${session.partner1Id}`), {
    activeSessionId: sessionId,
    pendingSessionId: null,
  });
  await update(ref(database, `users/${session.partner2Id}`), {
    activeSessionId: sessionId,
    pendingSessionId: null,
  });
}

export async function declineSession(sessionId: string, userId: string): Promise<void> {
  await update(ref(database, `sessions/${sessionId}`), { status: 'cancelled' });
  await remove(ref(database, `users/${userId}/pendingSessionId`));
}

export async function cancelSession(
  sessionId: string,
  partner1Id: string,
  partner2Id: string
): Promise<void> {
  await update(ref(database, `sessions/${sessionId}`), { status: 'cancelled' });
  await remove(ref(database, `users/${partner1Id}/activeSessionId`));
  await remove(ref(database, `users/${partner2Id}/activeSessionId`));
}

export async function completeSession(
  sessionId: string,
  partner1Id: string,
  partner2Id: string
): Promise<void> {
  await update(ref(database, `sessions/${sessionId}`), { status: 'completed' });
  await remove(ref(database, `users/${partner1Id}/activeSessionId`));
  await remove(ref(database, `users/${partner2Id}/activeSessionId`));
}

export async function recordViolation(
  sessionId: string,
  userKey: 'partner1' | 'partner2'
): Promise<string> {
  const newRef = push(ref(database, `sessions/${sessionId}/violations/${userKey}`));
  const violationId = newRef.key!;
  await set(newRef, {
    id: violationId,
    timestamp: Date.now(),
    duration: 0,
    returned: false,
  });
  return violationId;
}

export async function resolveViolation(
  sessionId: string,
  userKey: 'partner1' | 'partner2',
  violationId: string,
  durationSeconds: number
): Promise<void> {
  await update(
    ref(database, `sessions/${sessionId}/violations/${userKey}/${violationId}`),
    { duration: durationSeconds, returned: true }
  );
}
