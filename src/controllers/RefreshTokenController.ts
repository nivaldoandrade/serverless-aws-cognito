import {
  GetTokensFromRefreshTokenCommand,
  RefreshTokenReuseException,
} from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod/mini';
import { cognitoClient } from '../clients/cognitoClient';
import { env } from '../config/env';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

const schema = z.object({
  refreshToken: z.string().check(z.minLength(1, "'refreshToken' is required")),
});

type RefreshTokenBody = z.infer<typeof schema>;

export class RefreshTokenController implements IController {
  async execute({
    body,
  }: IControllerRequest<RefreshTokenBody>): Promise<ControllerResponse> {
    try {
      const { refreshToken } = schema.parse(body);

      const command = new GetTokensFromRefreshTokenCommand({
        RefreshToken: refreshToken,
        ClientId: env.COGNITO_CLIENT_ID,
        ClientSecret: env.COGNITO_CLIENT_SECRET,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (
        !AuthenticationResult?.AccessToken ||
        !AuthenticationResult?.RefreshToken
      ) {
        throw new Error('Error in cognito to refresh token');
      }

      return {
        statusCode: 201,
        body: {
          accessToken: AuthenticationResult.AccessToken,
          refreshToken: AuthenticationResult.AccessToken,
        },
      };
    } catch (error) {
      if (error instanceof RefreshTokenReuseException) {
        return {
          statusCode: error.$response?.statusCode || 400,
          body: {
            error: error.message,
          },
        };
      }

      throw error;
    }
  }
}
