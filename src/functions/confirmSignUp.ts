import {
  CodeMismatchException,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  TooManyRequestsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';
import { generateSecretHash } from '../utils/generateSecretHash';

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = bodyParser(event.body);

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: generateSecretHash(body.email),
      Username: body.email,
      ConfirmationCode: body.code,
    });

    await cognitoClient.send(command);

    return {
      statusCode: 204,
    };
  } catch (error) {
    if (
      error instanceof ExpiredCodeException ||
      error instanceof TooManyRequestsException ||
      error instanceof CodeMismatchException
    ) {
      return {
        statusCode: error.$response?.statusCode,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
      }),
    };
  }
}
