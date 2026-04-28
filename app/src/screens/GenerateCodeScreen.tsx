import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { MainStackParamList } from '../types/navigation.types';
import colors from '../constants/colors';

type Route = RouteProp<MainStackParamList, 'GenerateCode'>;

export default function GenerateCodeScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { code, expiresAt } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    return onValue(ref(database, `users/${uid}/partnerId`), (snapshot) => {
      if (snapshot.exists() && snapshot.val()) {
        navigation.goBack();
        navigation.goBack();
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const expired = secondsLeft === 0;

  const handleShare = () => {
    Share.share({
      message: `Use this code to pair with me on Lockbox: ${code}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your pairing code</Text>
      <Text style={styles.subtitle}>Share this with your partner</Text>

      <View style={[styles.codeCard, expired && styles.codeCardExpired]}>
        <Text style={[styles.code, expired && styles.codeExpired]}>
          {code}
        </Text>
        <Text style={[styles.timer, expired && styles.timerExpired]}>
          {expired
            ? 'Code expired — go back and generate a new one'
            : `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}`}
        </Text>
      </View>

      {!expired && (
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share code</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        Once your partner enters this code, you'll be paired automatically.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 24,
  },
  codeCardExpired: {
    opacity: 0.5,
  },
  code: {
    fontSize: 52,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: 12,
  },
  codeExpired: {
    color: colors.textLight,
  },
  timer: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerExpired: {
    color: colors.error,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 24,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  hint: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
