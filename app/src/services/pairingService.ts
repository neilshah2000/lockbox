import { ref, set, get, update, remove } from 'firebase/database';
import { database } from './firebase';

const CODE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createPairingCode(userId: string): Promise<string> {
  const code = generateCode();
  await set(ref(database, `pairingCodes/${code}`), {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + CODE_EXPIRY_MS,
  });
  return code;
}

export async function enterPairingCode(
  code: string,
  currentUserId: string
): Promise<void> {
  const codeRef = ref(database, `pairingCodes/${code}`);
  const snapshot = await get(codeRef);

  if (!snapshot.exists()) {
    throw new Error('Invalid code. Please check and try again.');
  }

  const data = snapshot.val();

  if (data.userId === currentUserId) {
    throw new Error("That's your own code. Ask your partner for their code.");
  }

  const partnerId = data.userId;

  await Promise.all([
    update(ref(database, `users/${currentUserId}`), { partnerId }),
    update(ref(database, `users/${partnerId}`), { partnerId: currentUserId }),
    remove(codeRef),
  ]);
}

export async function unpair(
  currentUserId: string,
  partnerId: string
): Promise<void> {
  await Promise.all([
    update(ref(database, `users/${currentUserId}`), { partnerId: null }),
    update(ref(database, `users/${partnerId}`), { partnerId: null }),
  ]);
}
