import {
  GetTokensFromRefreshTokenCommand,
  RefreshTokenReuseException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';
import { bodyParser } from '../utils/bodyParser';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken } = bodyParser(event.body);

    const command = new GetTokensFromRefreshTokenCommand({
      RefreshToken: refreshToken,
      ClientId: process.env.COGNITO_CLIENT_ID,
      ClientSecret: process.env.COGNITO_CLIENT_SECRET,
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (
      !AuthenticationResult?.AccessToken ||
      !AuthenticationResult.RefreshToken
    ) {
      throw new Error('Error in cognito to refresh token');
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.AccessToken,
      }),
    };
  } catch (error) {
    if (error instanceof RefreshTokenReuseException) {
      return {
        statusCode: error.$response?.statusCode,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }
  }
}
