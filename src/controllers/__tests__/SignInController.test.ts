import {
  AuthenticationResultType,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { describe } from 'node:test';
import { $ZodError } from 'zod/v4/core';
import { mockCognitoSend } from '../../tests/mocks/awsClients';
import { SignInController } from '../SignInController';

describe('SignInController', () => {
  let controller: SignInController;

  beforeEach(() => {
    controller = new SignInController();
    jest.clearAllMocks();
  });

  const body = {
    email: 'john.doe@mail.com',
    password: '12345678',
  };

  test('should be sign in successfully and return tokens', async () => {
    const mockAuthenticationResult = {
      AccessToken: 'accesToken',
      RefreshToken: 'refreshToken',
    } as AuthenticationResultType;

    mockCognitoSend.mockResolvedValueOnce({
      AuthenticationResult: mockAuthenticationResult,
    });

    const response = await controller.execute({ body });

    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.any(InitiateAuthCommand),
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: 'accesToken',
      refreshToken: 'refreshToken',
    });
  });

  test('should be throw error when cognito does not return tokens', async () => {
    mockCognitoSend.mockResolvedValueOnce({});

    await expect(controller.execute({ body })).rejects.toThrow(
      `Error in cognito to signin user: ${body.email}`,
    );
  });

  test('should be validate input schema and throw if invalid', async () => {
    const invalidBody = {
      email: '',
      password: '12345678',
    };

    await expect(controller.execute({ body: invalidBody })).rejects.toThrow(
      $ZodError,
    );
  });
});
