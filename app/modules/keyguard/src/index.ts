import { requireNativeModule, EventEmitter } from 'expo-modules-core';
import { Platform, AppState } from 'react-native';

let native: any = null;
let emitter: InstanceType<typeof EventEmitter> | null = null;
try {
  native = requireNativeModule('Keyguard');
  emitter = new EventEmitter(native);
  console.log('[Keyguard] Native module loaded');
} catch (e) {
  console.log('[Keyguard] Native module FAILED to load:', e);
}

export async function isScreenOff(): Promise<boolean> {
  if (Platform.OS !== 'android' || !native) return false;
  return native.isScreenOff();
}

export function addScreenOffListener(callback: () => void): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onScreenOff', callback);
}

export function addLogListener(callback: (message: string) => void): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onLog', (e: { message: string }) => callback(e.message));
}

export function addUserPresentListener(callback: () => void): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onUserPresent', callback);
}
