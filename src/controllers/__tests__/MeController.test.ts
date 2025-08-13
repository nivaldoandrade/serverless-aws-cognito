import { describe } from 'node:test';
import { env } from '../../config/env';
import { mockDynamoSend } from '../../tests/mocks/awsClients';
import { MeController } from '../MeController';

describe('MeController', () => {
  let controller: MeController;

  beforeAll(() => {
    controller = new MeController();
    jest.clearAllMocks();
  });

  const accountId = 'account-id';

  const Items = [
    {
      type: 'ACCOUNT',
      email: 'john.doe@mail.com',
    },
    {
      type: 'PROFILE',
      name: 'John Doe',
    },
  ];

  test('should be retrieve info user', async () => {
    mockDynamoSend.mockReturnValueOnce({ Items });

    const response = await controller.execute({ accountId, body: {} });

    expect(mockDynamoSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: env.TABLE_NAME,
          Limit: 2,
          ProjectionExpression: '#email, #name, #type',
          KeyConditionExpression: '#PK = :PK',
          ExpressionAttributeNames: {
            '#PK': 'PK',
            '#email': 'email',
            '#name': 'name',
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':PK': `ACCOUNT#${accountId}`,
          },
        }),
      }),
    );

    expect(response).toEqual({
      statusCode: 200,
      body: {
        name: 'John Doe',
        email: 'john.doe@mail.com',
      },
    });
  });

  test('should be throw error when dynamo does not return Items', async () => {
    mockDynamoSend.mockReturnValueOnce({ Items: [] });

    await expect(controller.execute({ accountId, body: {} })).rejects.toThrow(
      'Account not found.',
    );
  });

  test('should propagate DynamoDB errors', async () => {
    const error = new Error('DynamoDB failure.');

    mockDynamoSend.mockRejectedValueOnce(error);

    await expect(controller.execute({ accountId, body: {} })).rejects.toThrow(
      error,
    );
  });
});
