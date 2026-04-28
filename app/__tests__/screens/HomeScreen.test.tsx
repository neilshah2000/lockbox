import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn().mockResolvedValue({}),
}));

const mockOnValue = jest.fn((_ref: any, _cb: any) => jest.fn());

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: (ref: any, cb: any) => mockOnValue(ref, cb),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: {},
  database: {},
}));

jest.mock('../../src/services/pairingService', () => ({
  unpair: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/userService', () => ({
  getUser: jest.fn().mockResolvedValue(null),
}));

const mockUser = {
  uid: 'user-123',
  displayName: 'Neil Shah',
  email: 'talktoneilshah@gmail.com',
  photoURL: null,
};

describe('HomeScreen', () => {
  it('renders the user name', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Neil Shah')).toBeTruthy();
  });

  it('renders the user email', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('talktoneilshah@gmail.com')).toBeTruthy();
  });

  it('renders not paired status by default', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Not paired')).toBeTruthy();
  });

  it('renders pair with partner button', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Pair with partner')).toBeTruthy();
  });

  it('renders sign out button', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Sign out')).toBeTruthy();
  });

  it('calls signOut when sign out is pressed', () => {
    const { signOut } = require('firebase/auth');
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    fireEvent.press(getByText('Sign out'));
    expect(signOut).toHaveBeenCalled();
  });

  it('shows partner name when paired', async () => {
    const { getUser } = require('../../src/services/userService');
    getUser.mockResolvedValueOnce({ displayName: 'Jane', photoURL: null });

    mockOnValue.mockImplementationOnce(((_ref: any, callback: any) => {
      callback({ exists: () => true, val: () => ({ partnerId: 'partner-456' }) });
      return jest.fn();
    }) as any);

    const { findByText } = render(<HomeScreen user={mockUser as any} />);
    expect(await findByText('Paired with Jane')).toBeTruthy();
  });

  it('shows unpair button when paired', async () => {
    const { getUser } = require('../../src/services/userService');
    getUser.mockResolvedValueOnce({ displayName: 'Jane', photoURL: null });

    mockOnValue.mockImplementationOnce(((_ref: any, callback: any) => {
      callback({ exists: () => true, val: () => ({ partnerId: 'partner-456' }) });
      return jest.fn();
    }) as any);

    const { findByText } = render(<HomeScreen user={mockUser as any} />);
    expect(await findByText('Unpair')).toBeTruthy();
  });
});
