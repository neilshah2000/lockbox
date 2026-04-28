import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Share } from 'react-native';
import GenerateCodeScreen from '../../src/screens/GenerateCodeScreen';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: mockRouteParams }),
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn(() => jest.fn()),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: { currentUser: { uid: 'user-123' } },
  database: {},
}));

const mockRouteParams = {
  code: '123456',
  expiresAt: Date.now() + 10 * 60 * 1000,
};

describe('GenerateCodeScreen', () => {
  it('renders the pairing code', () => {
    const { getByText } = render(<GenerateCodeScreen />);
    expect(getByText('123456')).toBeTruthy();
  });

  it('renders the countdown timer', () => {
    const { getByText } = render(<GenerateCodeScreen />);
    expect(getByText(/Expires in/)).toBeTruthy();
  });

  it('renders the share button when not expired', () => {
    const { getByText } = render(<GenerateCodeScreen />);
    expect(getByText('Share code')).toBeTruthy();
  });

  it('calls Share.share with the code when share is pressed', () => {
    const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as any);
    const { getByText } = render(<GenerateCodeScreen />);
    fireEvent.press(getByText('Share code'));
    expect(shareSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('123456'),
    }));
  });

  it('shows expired message when code has expired', () => {
    mockRouteParams.code = '999999';
    mockRouteParams.expiresAt = Date.now() - 1000;
    const { getByText, queryByText } = render(<GenerateCodeScreen />);
    expect(getByText(/Code expired/)).toBeTruthy();
    expect(queryByText('Share code')).toBeNull();
    mockRouteParams.code = '123456';
    mockRouteParams.expiresAt = Date.now() + 10 * 60 * 1000;
  });
});
