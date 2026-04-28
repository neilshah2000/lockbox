import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation.types';
import { createPairingCode } from '../services/pairingService';
import { auth } from '../services/firebase';
import colors from '../constants/colors';

type Nav = NativeStackNavigationProp<MainStackParamList, 'Pairing'>;

export default function PairingScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Not logged in');
      const code = await createPairingCode(userId);
      navigation.navigate('GenerateCode', {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair with your partner</Text>
      <Text style={styles.subtitle}>
        One of you generates a code, the other enters it.
      </Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <>
              <Text style={styles.primaryButtonTitle}>Generate a code</Text>
              <Text style={styles.primaryButtonSub}>Share it with your partner</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('EnterCode')}
        >
          <Text style={styles.secondaryButtonTitle}>Enter a code</Text>
          <Text style={styles.secondaryButtonSub}>Enter your partner's code</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  options: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  primaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.surface,
    marginBottom: 4,
  },
  primaryButtonSub: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  secondaryButtonSub: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  error: {
    marginTop: 24,
    color: colors.error,
    textAlign: 'center',
    fontSize: 14,
  },
});
