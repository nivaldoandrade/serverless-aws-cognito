import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { describe } from 'node:test';
import { $ZodError } from 'zod/v4/core';
import { mockCognitoSend } from '../../tests/mocks/awsClients';
import { ForgotPasswordController } from '../ForgotPasswordController';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  beforeAll(() => {
    controller = new ForgotPasswordController();
    jest.clearAllMocks();
  });

  const body = {
    email: 'john.doe@mail.com',
  };

  test('should be generate code to reset account user', async () => {
    mockCognitoSend();

    const response = await controller.execute({ body });

    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.any(ForgotPasswordCommand),
    );
    expect(response.statusCode).toBe(204);
  });

  test('should be catch error but returns status code 204', async () => {
    const error = new Error('Error');

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response.statusCode).toBe(204);
  });

  test('should be validate body schema and throw if invalid', async () => {
    const invalidBody = {
      email: '',
    };

    await expect(controller.execute({ body: invalidBody })).rejects.toThrow(
      $ZodError,
    );
  });
});
