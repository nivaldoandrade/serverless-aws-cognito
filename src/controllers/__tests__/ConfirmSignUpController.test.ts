import {
  CodeMismatchException,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  TooManyRequestsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { describe } from 'node:test';
import { $ZodError } from 'zod/v4/core';
import { mockCognitoSend } from '../../tests/mocks/awsClients';
import { ConfirmSignUpController } from '../ConfirmSignUpController';

describe('ConfirmSignUpController', () => {
  let controller: ConfirmSignUpController;

  beforeAll(() => {
    controller = new ConfirmSignUpController();
    jest.clearAllMocks();
  });

  const body = {
    email: 'john.doe@mail.com',
    code: '12345678',
  };

  test('should be a confirmed account', async () => {
    mockCognitoSend.mockResolvedValueOnce({});

    const response = await controller.execute({ body });

    expect(mockCognitoSend).toHaveBeenLastCalledWith(
      expect.any(ConfirmSignUpCommand),
    );

    expect(response.statusCode).toBe(204);
  });

  test('should be validate body schema and throw if invalid', async () => {
    const invalideBody = {
      email: '',
      code: '',
    };

    await expect(controller.execute({ body: invalideBody })).rejects.toThrow(
      $ZodError,
    );
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

  test('should be throw error when too many request', async () => {
    const error = new TooManyRequestsException({
      message: 'Rate exceeded',
      $metadata: {},
    });

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response).toEqual({
      statusCode: 400,
      body: {
        error: 'Rate exceeded',
      },
    });
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

  test('should be throw other errors', async () => {
    const error = new Error('Error');

    mockCognitoSend.mockRejectedValueOnce(error);

    await expect(controller.execute({ body })).rejects.toThrow('Error');
  });
});
