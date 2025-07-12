import {
  CodeMismatchException,
  ConfirmForgotPasswordCommand,
  ExpiredCodeException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';
import { generateSecretHash } from '../utils/generateSecretHash';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: generateSecretHash(body.email),
      ConfirmationCode: body.code,
      Username: body.email,
      Password: body.password,
    });

    await cognitoClient.send(command);

    return {
      statusCode: 204,
    };
  } catch (error) {
    if (
      error instanceof CodeMismatchException ||
      error instanceof ExpiredCodeException
    ) {
      return {
        statusCode: error.$response?.statusCode,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }

    console.log(error);
  }
}
