import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { isScreenOff, addScreenOffListener, addUserPresentListener, addLogListener } from 'keyguard';
import {
  cancelSession,
  completeSession,
  recordViolation,
  resolveViolation,
} from '../services/sessionService';
import { getUser } from '../services/userService';
import { Session } from '../types/session.types';
import { MainStackParamList } from '../types/navigation.types';
import colors from '../constants/colors';

type Nav = NativeStackNavigationProp<MainStackParamList, 'ActiveSession'>;

interface Props {
  sessionId: string;
}

function formatTime(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function ActiveSessionScreen({ sessionId }: Props) {
  const navigation = useNavigation<Nav>();
  const [session, setSession] = useState<Session | null>(null);       // full session object from Firebase
  const [partnerName, setPartnerName] = useState('');                 // partner's display name, fetched once
  const [timeLeft, setTimeLeft] = useState(0);                        // ms remaining, ticked down every second
  const [partnerLeft, setPartnerLeft] = useState(false);              // partner has an unresolved violation
  const [iLeft, setILeft] = useState(false);                          // I have an unresolved violation
  const serverOffset = useRef(0);                                      // Firebase clock offset so both phones agree on timeLeft

  const sessionRef = useRef<Session | null>(null);                    // mirror of session for use inside event handlers (avoids stale closures)
  const completedRef = useRef(false);                                  // prevents completeSession / goBack firing twice

  // Keep server clock offset so both phones compute identical timeLeft
  useEffect(() => {
    return onValue(ref(database, '.info/serverTimeOffset'), (snap: DataSnapshot) => {
      serverOffset.current = snap.val() ?? 0;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, `sessions/${sessionId}`), async (snap) => {
      if (!snap.exists()) return;
      const data = snap.val() as Session;
      setSession(data);
      sessionRef.current = data;

      if (data.status === 'cancelled' || data.status === 'completed') {
        if (!completedRef.current) {
          completedRef.current = true;
          navigation.goBack();
        }
        return;
      }

      const uid = auth.currentUser?.uid;
      const isPartner1 = data.partner1Id === uid;
      const myViolations = isPartner1 ? data.violations?.partner1 : data.violations?.partner2;
      const theirViolations = isPartner1 ? data.violations?.partner2 : data.violations?.partner1;

      const theirActiveViolation = Object.values(theirViolations ?? {}).find((v) => !v.returned);
      setPartnerLeft(!!theirActiveViolation);

      const myActiveViolation = Object.values(myViolations ?? {}).find((v) => !v.returned);
      setILeft(!!myActiveViolation);

      // If we have an unresolved violation but the app is foregrounded (e.g. after a restart),
      // resolve it now — the normal AppState handler never fired in that case
      if (myActiveViolation && AppState.currentState === 'active') {
        const userKey = isPartner1 ? 'partner1' : 'partner2';
        const duration = Math.round((Date.now() - myActiveViolation.timestamp) / 1000);
        resolveViolation(sessionId, userKey, myActiveViolation.id, duration);
      }

      if (!partnerName) {
        const partnerId = isPartner1 ? data.partner2Id : data.partner1Id;
        const partnerData = await getUser(partnerId);
        if (partnerData) setPartnerName(partnerData.displayName);
      }
    });

    return unsubscribe;
  }, [sessionId]);

  // Countdown timer - endTime derived from server startTime so both phones agree
  useEffect(() => {
    const interval = setInterval(() => {
      const s = sessionRef.current;
      if (!s?.startTime) return;
      const endTime = s.startTime + s.duration * 60 * 1000;
      const serverNow = Date.now() + serverOffset.current;
      const remaining = endTime - serverNow;
      if (remaining <= 0) {
        setTimeLeft(0);
        if (!completedRef.current) {
          completedRef.current = true;
          completeSession(sessionId, s.partner1Id, s.partner2Id);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Forward native Kotlin logs to Metro console
  useEffect(() => {
    const sub = addLogListener((message) => console.log(message));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = addScreenOffListener(async () => {
      console.log(`[ScreenOff] Screen locked — AppState=${AppState.currentState}`);
      if (AppState.currentState !== 'background') return;
      const s = sessionRef.current;
      if (!s || s.status !== 'active') return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const isPartner1 = s.partner1Id === uid;
      const myViolations = isPartner1 ? s.violations?.partner1 : s.violations?.partner2;
      const v = Object.values(myViolations ?? {}).find(v => !v.returned);
      if (!v) return;
      const userKey = isPartner1 ? 'partner1' : 'partner2';
      const duration = Math.round((Date.now() - v.timestamp) / 1000);
      console.log(`[ScreenOff] Resolving violation — user locked screen (${duration}s)`);
      await resolveViolation(sessionId, userKey, v.id, duration);
    });
    return () => sub.remove();
  }, [sessionId]);

  // AppState monitoring - detect when user leaves app
  useEffect(() => {
    const handleChange = async (nextState: AppStateStatus) => {
      console.log(`[AppState] ${nextState}`);
      const s = sessionRef.current;
      if (!s || s.status !== 'active') return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const userKey = s.partner1Id === uid ? 'partner1' : 'partner2';

      if (nextState === 'background') {
        if (await isScreenOff()) return;
        console.log('[AppState] User left app');
        await recordViolation(sessionId, userKey);
      } else if (nextState === 'active') {
        const isPartner1 = s.partner1Id === uid;
        const myViolations = isPartner1 ? s.violations?.partner1 : s.violations?.partner2;
        const v = Object.values(myViolations ?? {}).find(v => !v.returned);
        if (v) {
          const duration = Math.round((Date.now() - v.timestamp) / 1000);
          console.log(`[AppState] User returned (${duration}s)`);
          await resolveViolation(sessionId, userKey, v.id, duration);
        }
      }
    };

    const sub = AppState.addEventListener('change', handleChange);
    return () => sub.remove();
  }, [sessionId]);

  // Detect unlock-to-another-app (e.g. tapping a notification from the lock screen)
  useEffect(() => {
    const sub = addUserPresentListener(() => {
      console.log(`[Keyguard] ACTION_USER_PRESENT — AppState=${AppState.currentState}`);
      setTimeout(async () => {
        console.log(`[Keyguard] 500ms later — AppState=${AppState.currentState}`);
        if (AppState.currentState === 'active') {
          console.log('[Keyguard] User returned to Lockbox — no violation');
          return;
        }
        const s = sessionRef.current;
        if (!s || s.status !== 'active') return;
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const isPartner1 = s.partner1Id === uid;
        const myViolations = isPartner1 ? s.violations?.partner1 : s.violations?.partner2;
        const hasActiveViolation = Object.values(myViolations ?? {}).some(v => !v.returned);
        if (hasActiveViolation) return;
        const userKey = isPartner1 ? 'partner1' : 'partner2';
        console.log('[Keyguard] User unlocked to another app — recording violation');
        await recordViolation(sessionId, userKey);
      }, 500);
    });
    return () => sub.remove();
  }, [sessionId]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (completedRef.current) return;
      e.preventDefault();
      handleCancel();
    });
  }, [navigation]);

  const handleCancel = () => {
    Alert.alert('End session early?', 'This will cancel the session for both of you.', [
      { text: 'Keep going', style: 'cancel' },
      {
        text: 'End session',
        style: 'destructive',
        onPress: () => {
          const s = sessionRef.current;
          if (s) cancelSession(sessionId, s.partner1Id, s.partner2Id);
        },
      },
    ]);
  };

  if (!session || !session.startTime) {
    return (
      <View style={styles.container}>
        <Text style={styles.waiting}>Starting session...</Text>
      </View>
    );
  }

  const totalMs = session.duration * 60 * 1000;
  const progress = session.startTime ? Math.max(0, Math.min(1, timeLeft / totalMs)) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Session in progress</Text>

      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Time remaining</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <View style={[styles.dot, iLeft ? styles.dotRed : styles.dotGreen]} />
          <Text style={styles.statusName}>You</Text>
          <Text style={styles.statusText}>{iLeft ? 'Left app' : 'Present'}</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <View style={[styles.dot, partnerLeft ? styles.dotRed : styles.dotGreen]} />
          <Text style={styles.statusName}>{partnerName || 'Partner'}</Text>
          <Text style={styles.statusText}>{partnerLeft ? 'Left app' : 'Present'}</Text>
        </View>
      </View>

      {partnerLeft && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            {partnerName} has left the app
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelText}>End session early</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    alignItems: 'center',
  },
  waiting: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 32,
  },
  timerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  timerLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  statusRow: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statusDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotGreen: {
    backgroundColor: colors.online,
  },
  dotRed: {
    backgroundColor: colors.error,
  },
  statusName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  alert: {
    backgroundColor: colors.violation + '33',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.violation,
  },
  alertText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  cancelBtn: {
    marginTop: 'auto',
    marginBottom: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  cancelText: {
    fontSize: 15,
    color: colors.error,
  },
});
