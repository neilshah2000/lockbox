import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';

jest.mock('firebase/auth', () => ({
  signOut: jest.fn().mockResolvedValue({}),
  getAuth: jest.fn(),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: {},
}));

const mockUser = {
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

  it('renders not paired status', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Not paired')).toBeTruthy();
  });

  it('renders sign out button', () => {
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    expect(getByText('Sign out')).toBeTruthy();
  });

  it('calls signOut when sign out is pressed', async () => {
    const { signOut } = require('firebase/auth');
    const { getByText } = render(<HomeScreen user={mockUser as any} />);
    fireEvent.press(getByText('Sign out'));
    expect(signOut).toHaveBeenCalled();
  });
});
