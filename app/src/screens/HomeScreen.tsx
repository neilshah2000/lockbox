import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { User, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import colors from '../constants/colors';

interface Props {
  user: User;
}

export default function HomeScreen({ user }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lockbox</Text>

      <View style={styles.profile}>
        {user.photoURL && (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusIcon}>🔗</Text>
        <Text style={styles.statusTitle}>Not paired</Text>
        <Text style={styles.statusSub}>Pair with your partner to start locking sessions</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.signOutText}>Sign out</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 16,
    marginBottom: 32,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 'auto',
  },
  statusIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statusSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signOutButton: {
    marginBottom: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  signOutText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
