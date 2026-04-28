import { createPairingCode, enterPairingCode, unpair } from '../../src/services/pairingService';

const mockSet = jest.fn().mockResolvedValue(undefined);
const mockGet = jest.fn();
const mockUpdate = jest.fn().mockResolvedValue(undefined);
const mockRemove = jest.fn().mockResolvedValue(undefined);

jest.mock('firebase/database', () => ({
  ref: jest.fn(() => 'mock-ref'),
  set: (...args: any[]) => mockSet(...args),
  get: (...args: any[]) => mockGet(...args),
  update: (...args: any[]) => mockUpdate(...args),
  remove: (...args: any[]) => mockRemove(...args),
}));

jest.mock('../../src/services/firebase', () => ({ database: {} }));

describe('pairingService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createPairingCode', () => {
    it('generates a 6-digit code and saves it to Firebase', async () => {
      const code = await createPairingCode('user-123');
      expect(code).toMatch(/^\d{6}$/);
      expect(mockSet).toHaveBeenCalledWith('mock-ref', expect.objectContaining({
        userId: 'user-123',
      }));
    });
  });

  describe('enterPairingCode', () => {
    it('throws if code does not exist', async () => {
      mockGet.mockResolvedValueOnce({ exists: () => false });
      await expect(enterPairingCode('000000', 'user-abc')).rejects.toThrow('Invalid code');
    });

    it("throws if user enters their own code", async () => {
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ userId: 'user-abc', createdAt: 0, expiresAt: Date.now() + 60000 }),
      });
      await expect(enterPairingCode('123456', 'user-abc')).rejects.toThrow("your own code");
    });

    it('links both users and removes the code on success', async () => {
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ userId: 'user-456', createdAt: 0, expiresAt: Date.now() + 60000 }),
      });
      await enterPairingCode('123456', 'user-abc');
      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('unpair', () => {
    it('clears partnerId for both users', async () => {
      await unpair('user-abc', 'user-456');
      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockUpdate).toHaveBeenCalledWith('mock-ref', { partnerId: null });
    });
  });
});
