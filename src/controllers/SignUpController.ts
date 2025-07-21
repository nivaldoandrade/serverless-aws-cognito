import {
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import * as z from 'zod/mini';
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
    .check(z.minLength(8, "'password' shoud be at least 8 charactres long.")),
});

type SignUpBody = z.infer<typeof schema>;

export class SignUpController implements IController {
  async execute({
    body,
  }: IControllerRequest<SignUpBody>): Promise<ControllerResponse> {
    const { email, password } = schema.parse(body);

    try {
      const command = new SignUpCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        SecretHash: generateSecretHash(email),
        Username: email,
        Password: password,
      });

      const { UserSub } = await cognitoClient.send(command);

      return {
        statusCode: 201,
        body: {
          externalId: UserSub,
        },
      };
    } catch (error) {
      if (error instanceof UsernameExistsException) {
        return {
          statusCode: 409,
          body: {
            error: error.message,
          },
        };
      }

      throw error;
    }
  }
}
