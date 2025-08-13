import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod/mini';
import { $ZodError } from 'zod/v4/core';
import { cognitoClient } from '../clients/cognitoClient';
import { env } from '../config/env';
import { generateSecretHash } from '../utils/generateSecretHash';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

const schema = z.object({
  email: z.string("'email' is required").check(z.email("'email' is invalid")),
});

type ForgotPasswordBody = z.infer<typeof schema>;

export class ForgotPasswordController implements IController {
  async execute({
    body,
  }: IControllerRequest<ForgotPasswordBody>): Promise<ControllerResponse> {
    try {
      const { email } = schema.parse(body);

      const command = new ForgotPasswordCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        SecretHash: generateSecretHash(email),
        Username: email,
      });

      await cognitoClient.send(command);
    } catch (error) {
      if (error instanceof $ZodError) {
        throw error;
      }
      console.log(error);
    }

    return {
      statusCode: 204,
    };
  }
}
