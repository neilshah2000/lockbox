import { ref, set, get, update } from 'firebase/database';
import { User as FirebaseUser } from 'firebase/auth';
import { database } from './firebase';
import { User } from '../types/user.types';

export async function saveUser(firebaseUser: FirebaseUser): Promise<void> {
  const userRef = ref(database, `users/${firebaseUser.uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    await update(userRef, {
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      lastOnline: Date.now(),
    });
  } else {
    await set(userRef, {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      partnerId: null,
      fcmToken: null,
      createdAt: Date.now(),
      lastOnline: Date.now(),
    });
  }
}

export async function getUser(userId: string): Promise<User | null> {
  const snapshot = await get(ref(database, `users/${userId}`));
  return snapshot.exists() ? (snapshot.val() as User) : null;
}
