import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ data: { idToken: 'mock-token' } }),
  },
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn().mockResolvedValue({}),
  getAuth: jest.fn(),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: {},
}));

describe('LoginScreen', () => {
  it('renders the app title', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Lockbox')).toBeTruthy();
  });

  it('renders the sign in button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('🔵 Sign in with Google')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Connect without distractions')).toBeTruthy();
  });

  it('renders the footer message', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText(/Put your phones away together/)).toBeTruthy();
  });
});
