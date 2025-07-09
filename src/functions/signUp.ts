import {
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';
import { generateSecretHash } from '../utils/generateSecretHash';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: generateSecretHash(body.email),
      Username: body.email,
      Password: body.password,
    });

    const { UserSub } = await cognitoClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        externalId: UserSub,
      }),
    };
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
}
