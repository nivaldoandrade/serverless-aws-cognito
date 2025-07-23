import {
  AdminDeleteUserCommand,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import * as z from 'zod/mini';
import { cognitoClient } from '../clients/cognitoClient';
import { dynamoClient } from '../clients/dynamoClient';
import { env } from '../config/env';
import { generateSecretHash } from '../utils/generateSecretHash';
import { generateUID } from '../utils/generateUID';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

const schema = z.object({
  name: z
    .string("'name' is required.")
    .check(z.minLength(1, "'name' cannot be empty.")),
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
    const { name, email, password } = schema.parse(body);

    let externalId: string | undefined;

    try {
      const command = new SignUpCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        SecretHash: generateSecretHash(email),
        Username: email,
        Password: password,
      });

      const { UserSub } = await cognitoClient.send(command);

      externalId = UserSub;

      const accountId = generateUID();

      const putCommand = new PutCommand({
        TableName: env.TABLE_NAME,
        Item: {
          PK: `ACCOUNT#${accountId}`,
          SK: `ACCOUNT#${accountId}`,
          type: 'ACCOUNT',
          id: accountId,
          externalId: UserSub!,
          email,
          name,
        },
      });

      await dynamoClient.send(putCommand);

      return {
        statusCode: 201,
        body: {
          accountId: accountId,
        },
      };
    } catch (error) {
      if (externalId) {
        const deleteUserCommand = new AdminDeleteUserCommand({
          Username: email,
          UserPoolId: env.COGNITO_USER_POOL_ID,
        });

        await cognitoClient.send(deleteUserCommand);
      }

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
