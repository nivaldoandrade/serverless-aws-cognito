import {
  AdminDeleteUserCommand,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { describe } from 'node:test';
import { env } from '../../config/env';
import { mockCognitoSend, mockDynamoSend } from '../../tests/mocks/awsClients';
import '../../tests/mocks/mockEnv';
import { SignUpController } from '../SignUpController';

jest.mock('../../config/env', () => ({
  env: {
    COGNITO_CLIENT_ID: 'mockClientId',
    COGNITO_USER_POOL_ID: 'mockUserPoolId',
    TABLE_NAME: 'mockTable',
  },
}));

describe('SignUpController', () => {
  let controller: SignUpController;

  beforeEach(() => {
    controller = new SignUpController();
    jest.clearAllMocks();
  });

  const body = {
    name: 'John Doe',
    email: 'john.doe@mail.com',
    password: '12345678',
  };

  test('should be sign up and create account/profile in DynamoDB', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      UserSub: 'user-sub-id-congnito',
    });

    mockDynamoSend.mockResolvedValueOnce({});

    const response = await controller.execute({ body });

    expect(mockCognitoSend).toHaveBeenCalledWith(expect.any(SignUpCommand));
    expect(mockDynamoSend).toHaveBeenCalledWith(
      expect.any(TransactWriteCommand),
    );

    expect(response.statusCode).toBe(201);
    expect(response.body?.accountId).toEqual(expect.any(String));
  });

  test('should be delete user from Cognito if DynamoDB transaction fails', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      UserSub: 'user-sub-id-congnito',
    });

    mockDynamoSend.mockRejectedValueOnce(new Error('DynamoDB Error'));

    mockCognitoSend.mockResolvedValueOnce({});

    await expect(controller.execute({ body })).rejects.toThrow(
      'DynamoDB Error',
    );

    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.any(AdminDeleteUserCommand),
    );
    expect(mockCognitoSend).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        input: expect.objectContaining({
          Username: body.email,
          UserPoolId: env.COGNITO_USER_POOL_ID,
        }),
      }),
    );
  });

  test('should be return 409 if username already exists', async () => {
    const error = new UsernameExistsException({
      message: 'User already existss',
      $metadata: {},
    });

    mockCognitoSend.mockRejectedValueOnce(error);

    const response = await controller.execute({ body });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      error: error.message,
    });
  });

  test('should be throw other errors', async () => {
    const error = new Error('Error');

    mockCognitoSend.mockRejectedValueOnce(error);

    await expect(controller.execute({ body })).rejects.toThrow('Error');
  });

  test('should be validate input schema and throw if invalid', async () => {
    const invalideBody = {
      name: 'John Doe',
      email: '',
      password: '12345678',
    };

    await expect(controller.execute({ body: invalideBody })).rejects.toThrow();
  });
});
