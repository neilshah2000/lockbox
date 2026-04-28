import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PairingScreen from '../../src/screens/PairingScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../src/services/pairingService', () => ({
  createPairingCode: jest.fn().mockResolvedValue('123456'),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: { currentUser: { uid: 'user-123' } },
}));

describe('PairingScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders both options', () => {
    const { getByText } = render(<PairingScreen />);
    expect(getByText('Generate a code')).toBeTruthy();
    expect(getByText('Enter a code')).toBeTruthy();
  });

  it('generates a code and navigates to GenerateCode screen', async () => {
    const { getByText } = render(<PairingScreen />);
    fireEvent.press(getByText('Generate a code'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('GenerateCode', expect.objectContaining({
        code: '123456',
      }));
    });
  });

  it('navigates to EnterCode screen', () => {
    const { getByText } = render(<PairingScreen />);
    fireEvent.press(getByText('Enter a code'));
    expect(mockNavigate).toHaveBeenCalledWith('EnterCode');
  });

  it('shows error message when code generation fails', async () => {
    const { createPairingCode } = require('../../src/services/pairingService');
    createPairingCode.mockRejectedValueOnce(new Error('Network error'));
    const { getByText, findByText } = render(<PairingScreen />);
    fireEvent.press(getByText('Generate a code'));
    expect(await findByText('Network error')).toBeTruthy();
  });
});
