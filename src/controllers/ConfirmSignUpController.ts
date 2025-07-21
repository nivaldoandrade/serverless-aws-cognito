import {
  CodeMismatchException,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  TooManyRequestsException,
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
  email: z.string("'email' is required.").check(z.email("'email' is invalid.")),
  code: z
    .string("'code' is required.")
    .check(z.minLength(6, "'code' should be at least 6 characters long.")),
});

type ConfirmSignUpBody = z.infer<typeof schema>;

export class ConfirmSignUpController implements IController {
  async execute({
    body,
  }: IControllerRequest<ConfirmSignUpBody>): Promise<ControllerResponse> {
    try {
      const { email, code } = schema.parse(body);

      const command = new ConfirmSignUpCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        SecretHash: generateSecretHash(email),
        Username: email,
        ConfirmationCode: code,
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
