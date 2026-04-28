import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EnterCodeScreen from '../../src/screens/EnterCodeScreen';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

const mockEnterPairingCode = jest.fn();

jest.mock('../../src/services/pairingService', () => ({
  enterPairingCode: (...args: any[]) => mockEnterPairingCode(...args),
}));

jest.mock('../../src/services/firebase', () => ({
  auth: { currentUser: { uid: 'user-abc' } },
}));

describe('EnterCodeScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the code input', () => {
    const { getByPlaceholderText } = render(<EnterCodeScreen />);
    expect(getByPlaceholderText('000000')).toBeTruthy();
  });

  it('only accepts digits', () => {
    const { getByPlaceholderText } = render(<EnterCodeScreen />);
    const input = getByPlaceholderText('000000');
    fireEvent.changeText(input, 'abc123');
    expect(input.props.value).toBe('123');
  });

  it('disables the button when code is less than 6 digits', () => {
    const { getByPlaceholderText, getByText } = render(<EnterCodeScreen />);
    fireEvent.changeText(getByPlaceholderText('000000'), '123');
    const button = getByText('Pair up').parent?.parent;
    expect(button?.props.accessibilityState?.disabled).toBe(true);
  });

  it('shows error from service if code is invalid', async () => {
    mockEnterPairingCode.mockRejectedValueOnce(new Error('Invalid code. Please check and try again.'));
    const { getByPlaceholderText, getByText } = render(<EnterCodeScreen />);
    fireEvent.changeText(getByPlaceholderText('000000'), '000000');
    fireEvent.press(getByText('Pair up'));
    await waitFor(() => {
      expect(getByText('Invalid code. Please check and try again.')).toBeTruthy();
    });
  });

  it('calls enterPairingCode with the entered code', async () => {
    mockEnterPairingCode.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<EnterCodeScreen />);
    fireEvent.changeText(getByPlaceholderText('000000'), '123456');
    fireEvent.press(getByText('Pair up'));
    await waitFor(() => {
      expect(mockEnterPairingCode).toHaveBeenCalledWith('123456', 'user-abc');
    });
  });

  it('navigates back twice on successful pairing', async () => {
    mockEnterPairingCode.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<EnterCodeScreen />);
    fireEvent.changeText(getByPlaceholderText('000000'), '123456');
    fireEvent.press(getByText('Pair up'));
    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(2);
    });
  });
});
