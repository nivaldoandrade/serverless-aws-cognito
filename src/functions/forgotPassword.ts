import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';
import { generateSecretHash } from '../utils/generateSecretHash';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: generateSecretHash(body.email),
      Username: body.email,
    });

    await cognitoClient.send(command);
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 204,
  };
}
