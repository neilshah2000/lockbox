import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { unpair } from '../services/pairingService';
import { getUser } from '../services/userService';
import { User as LockboxUser } from '../types/user.types';
import { MainStackParamList } from '../types/navigation.types';
import colors from '../constants/colors';

type Nav = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface Props {
  user: User;
}

export default function HomeScreen({ user }: Props) {
  const navigation = useNavigation<Nav>();
  const [lockboxUser, setLockboxUser] = useState<LockboxUser | null>(null);
  const [partner, setPartner] = useState<LockboxUser | null>(null);

  useEffect(() => {
    const userRef = ref(database, `users/${user.uid}`);
    return onValue(userRef, async (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as LockboxUser;
      setLockboxUser(data);
      if (data.partnerId) {
        const partnerData = await getUser(data.partnerId);
        setPartner(partnerData);
      } else {
        setPartner(null);
      }
    });
  }, [user.uid]);

  const handleUnpair = () => {
    Alert.alert(
      'Unpair',
      `Are you sure you want to unpair from ${partner?.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: async () => {
            if (lockboxUser?.partnerId) {
              await unpair(user.uid, lockboxUser.partnerId);
            }
          },
        },
      ]
    );
  };

  const isPaired = !!lockboxUser?.partnerId;

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
        {isPaired && partner ? (
          <>
            <Text style={styles.statusIcon}>🔗</Text>
            <Text style={styles.statusTitle}>Paired with {partner.displayName}</Text>
            <Text style={styles.statusSub}>You're ready to start a lock session</Text>
            <TouchableOpacity style={styles.unpairButton} onPress={handleUnpair}>
              <Text style={styles.unpairText}>Unpair</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.statusIcon}>🔗</Text>
            <Text style={styles.statusTitle}>Not paired</Text>
            <Text style={styles.statusSub}>Pair with your partner to start locking sessions</Text>
            <TouchableOpacity
              style={styles.pairButton}
              onPress={() => navigation.navigate('Pairing')}
            >
              <Text style={styles.pairButtonText}>Pair with partner</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginBottom: 32,
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
    marginBottom: 20,
  },
  pairButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  pairButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  unpairButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  unpairText: {
    fontSize: 14,
    color: colors.error,
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
