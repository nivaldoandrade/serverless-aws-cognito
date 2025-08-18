import {
  CodeMismatchException,
  ConfirmForgotPasswordCommand,
  ExpiredCodeException,
} from '@aws-sdk/client-cognito-identity-provider';
import { describe } from 'node:test';
import { $ZodError } from 'zod/v4/core';
import { mockCognitoSend } from '../../tests/mocks/awsClients';
import { ConfirmForgotPasswordController } from '../ConfirmForgotPasswordController';

describe('ConfirmForgotPasswordController', () => {
  let controller: ConfirmForgotPasswordController;

  beforeAll(() => {
    controller = new ConfirmForgotPasswordController();
    jest.clearAllMocks();
  });

  const body = {
    code: '12345678',
    email: 'john.doe@mail.com',
    password: '12345678',
  };

  test('should be reset password user', async () => {
    mockCognitoSend();

    const response = await controller.execute({ body });

    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.any(ConfirmForgotPasswordCommand),
    );

    expect(response.statusCode).toBe(204);
  });

  test('should be validate body schema and throw if invalid', async () => {
    const invalidBody = {
      code: '',
      email: '',
      password: '',
    };

    await expect(controller.execute({ body: invalidBody })).rejects.toThrow(
      $ZodError,
    );
  });

  test('should be throw error when code is invalid', async () => {
    const error = new CodeMismatchException({
      message: 'Code is invalid',
      $metadata: {},
    });

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response).toEqual({
      statusCode: 400,
      body: {
        error: 'Code is invalid',
      },
    });
  });

  test('should be throw error when code expires', async () => {
    const error = new ExpiredCodeException({
      message: 'Code has been expired',
      $metadata: {},
    });

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response).toEqual({
      statusCode: 400,
      body: {
        error: 'Code has been expired',
      },
    });
  });

  test('should be throw other errors', async () => {
    const error = new Error('Error');

    mockCognitoSend.mockRejectedValueOnce(error);

    await expect(controller.execute({ body })).rejects.toThrow('Error');
  });
});
