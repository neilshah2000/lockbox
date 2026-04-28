import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth } from '../services/firebase';
import { createSession } from '../services/sessionService';
import { MainStackParamList } from '../types/navigation.types';
import colors from '../constants/colors';

type Nav = NativeStackNavigationProp<MainStackParamList, 'StartSession'>;

const DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
];

interface Props {
  partnerId: string;
  partnerName: string;
}

export default function StartSessionScreen({ partnerId, partnerName }: Props) {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setLoading(true);
    setError('');
    try {
      await createSession(uid, partnerId, selected);
      navigation.goBack();
    } catch (e: any) {
      setError(e.message || 'Failed to start session');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a lock session</Text>
      <Text style={styles.subtitle}>
        Invite {partnerName} to lock your phones together
      </Text>

      <Text style={styles.label}>Choose duration</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.durationBtn, selected === d.value && styles.durationBtnSelected]}
            onPress={() => setSelected(d.value)}
          >
            <Text
              style={[styles.durationText, selected === d.value && styles.durationTextSelected]}
            >
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>📵</Text>
        <Text style={styles.infoText}>
          Both phones stay in the app for {DURATIONS.find((d) => d.value === selected)?.label}.
          If either of you leaves, your partner will know.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.startBtn, loading && styles.disabled]}
        onPress={handleStart}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.startBtnText}>Send invite to {partnerName}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  durationBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  durationTextSelected: {
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
  },
  cancelBtn: {
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
