import {
  CodeMismatchException,
  ConfirmForgotPasswordCommand,
  ExpiredCodeException,
} from '@aws-sdk/client-cognito-identity-provider';
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
  code: z
    .string("'code' is required.")
    .check(z.minLength(6, "'code' should be at least 6 characters long.")),
  email: z.string("'email' is required.").check(z.email("'email' is invalid.")),
  password: z
    .string("'password' is required.")
    .check(z.minLength(8, "'password' shoud be at least 8 charactres long.")),
});

type ConfirmForgotPasswordBody = z.infer<typeof schema>;

export class ConfirmForgotPasswordController implements IController {
  async execute({
    body,
  }: IControllerRequest<ConfirmForgotPasswordBody>): Promise<ControllerResponse> {
    try {
      const { code, email, password } = schema.parse(body);

      const command = new ConfirmForgotPasswordCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        SecretHash: generateSecretHash(email),
        ConfirmationCode: code,
        Username: email,
        Password: password,
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
