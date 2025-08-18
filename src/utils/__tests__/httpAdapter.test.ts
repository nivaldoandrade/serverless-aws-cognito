import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
} from 'aws-lambda';
import { describe } from 'node:test';
import { $ZodError, $ZodIssue } from 'zod/v4/core';
import { httpAdapter } from '../httpAdapter';

type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;

describe('httpAdapter', () => {
  const mockController = {
    execute: jest.fn(),
  };

  const event = {
    body: '{"name": "John Doe"}',
    requestContext: {},
  } as Event;

  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('should be return success response', async () => {
    mockController.execute.mockResolvedValueOnce({
      statusCode: 200,
      body: {
        success: true,
      },
    });

    const handler = httpAdapter(mockController);
    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    });
  });

  test('should be extract accountId when authorizer exist', async () => {
    mockController.execute.mockResolvedValueOnce({
      statusCode: 200,
      body: {
        success: true,
      },
    });

    const eventWithAuthorizer = {
      body: '{"name": "John Doe"}',
      requestContext: {
        authorizer: {
          jwt: {
            claims: {
              internalId: 'internalId',
            },
          },
        },
      },
    } as unknown as Event;

    const handler = httpAdapter(mockController);
    await handler(eventWithAuthorizer);

    expect(mockController.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 'internalId',
      }),
    );
  });

  test('should be return 400 status code when ZodError is throw', async () => {
    const issues: $ZodIssue[] = [
      {
        path: ['email'],
        message: 'Email is required',
        code: 'custom',
        input: 'email',
      },
    ];

    mockController.execute.mockRejectedValueOnce(new $ZodError(issues));

    const handler = httpAdapter(mockController);
    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: [
          {
            field: 'email',
            error: 'Email is required',
          },
        ],
      }),
    });
  });

  test('should be return 500 when generic error', async () => {
    mockController.execute.mockRejectedValueOnce(new Error('Error generic'));

    const handler = httpAdapter(mockController);
    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        message: 'Internal Server Error.',
      }),
    });
  });
});
