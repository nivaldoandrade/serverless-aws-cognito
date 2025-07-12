import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';
import { generateSecretHash } from '../utils/generateSecretHash';

export async function handler(event: APIGatewayProxyEventV2) {
  const body = bodyParser(event.body);

  const command = new InitiateAuthCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: body.email,
      PASSWORD: body.password,
      SECRET_HASH: generateSecretHash(body.email),
    },
  });

  const { AuthenticationResult } = await cognitoClient.send(command);

  if (
    !AuthenticationResult?.AccessToken ||
    !AuthenticationResult.RefreshToken
  ) {
    throw new Error(`Error in cognito to signin user: ${body.email}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      accessToken: AuthenticationResult.AccessToken,
      RefreshToken: AuthenticationResult.RefreshToken,
    }),
  };
}
