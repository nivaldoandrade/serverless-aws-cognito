import {
  AuthenticationResultType,
  RefreshTokenReuseException,
} from '@aws-sdk/client-cognito-identity-provider';
import { describe } from 'node:test';
import { $ZodError } from 'zod/v4/core';
import { mockCognitoSend } from '../../tests/mocks/awsClients';
import { RefreshTokenController } from '../RefreshTokenController';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;

  beforeAll(() => {
    controller = new RefreshTokenController();
    jest.clearAllMocks();
  });

  const body = {
    refreshToken: 'refresh-token',
  };

  test('should be create and return tokens', async () => {
    const mockAuthenticationResult = {
      AccessToken: 'accesToken',
      RefreshToken: 'refreshToken',
    } as AuthenticationResultType;

    mockCognitoSend.mockResolvedValueOnce({
      AuthenticationResult: mockAuthenticationResult,
    });

    const response = await controller.execute({ body });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: mockAuthenticationResult.AccessToken,
      refreshToken: mockAuthenticationResult.RefreshToken,
    });
  });

  test('should be throw error when cognito does not return tokens', async () => {
    mockCognitoSend.mockResolvedValueOnce({});

    await expect(controller.execute({ body })).rejects.toThrow(
      'Error in cognito to refresh token',
    );
  });

  test('should be throw error when refresh token was be reuse', async () => {
    const error = new RefreshTokenReuseException({
      message: 'Refresh token has been reused',
      $metadata: {},
    });

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response).toEqual({
      statusCode: 400,
      body: {
        error: error.message,
      },
    });
  });

  test('should be validate body schema and throw if invalid', async () => {
    const invalidBody = {
      refreshToken: '',
    };

    await expect(controller.execute({ body: invalidBody })).rejects.toThrow(
      $ZodError,
    );
  });
});
