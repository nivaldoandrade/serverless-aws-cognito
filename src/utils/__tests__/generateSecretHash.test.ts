import { createHmac } from 'node:crypto';
import { describe } from 'node:test';
import { env } from '../../config/env';
import { generateSecretHash } from '../generateSecretHash';

const mockUpdate = jest.fn().mockReturnThis();
const mockDigest = jest.fn();

jest.mock('node:crypto', () => ({
  createHmac: jest.fn(() => ({
    update: mockUpdate,
    digest: mockDigest,
  })),
}));

describe('generateSecretHash', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('should be create and return secret hashs', () => {
    const email = 'john.doe@mail.com';

    mockDigest.mockReturnValueOnce('secret-hash');

    const result = generateSecretHash(email);

    expect(createHmac).toHaveBeenCalledWith(
      'SHA256',
      env.COGNITO_CLIENT_SECRET,
    );
    expect(mockUpdate).toHaveBeenCalledWith(`${email}${env.COGNITO_CLIENT_ID}`);
    expect(mockDigest).toHaveBeenCalledWith('base64');
    expect(result).toBe('secret-hash');
  });
});
