import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod/mini';
import { cognitoClient } from '../clients/cognitoClient';
import { env } from '../config/env';
import { generateSecretHash } from '../utils/generateSecretHash';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

const schema = z.object({
  email: z.string("'email' is required.").check(z.email("'email' is invalid.")),
  password: z
    .string("'password' is required.")
    .check(z.minLength(8, "'password should be at least 8 characters long.")),
});

type SignInBody = z.infer<typeof schema>;

export class SignInController implements IController {
  async execute({
    body,
  }: IControllerRequest<SignInBody>): Promise<ControllerResponse> {
    const { email, password } = schema.parse(body);

    const command = new InitiateAuthCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (
      !AuthenticationResult?.AccessToken ||
      !AuthenticationResult.RefreshToken
    ) {
      throw new Error(`Error in cognito to signin user: ${email}`);
    }

    return {
      statusCode: 201,
      body: {
        accessToken: AuthenticationResult.AccessToken,
        RefreshToken: AuthenticationResult.RefreshToken,
      },
    };
  }
}
