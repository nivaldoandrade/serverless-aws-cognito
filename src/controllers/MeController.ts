import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../clients/cognitoClient';
import { env } from '../config/env';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

export class MeController implements IController {
  async execute({ userId }: IControllerRequest): Promise<ControllerResponse> {
    const command = new AdminGetUserCommand({
      Username: userId,
      UserPoolId: env.COGNITO_USER_POOL_ID,
    });

    const { UserAttributes } = await cognitoClient.send(command);

    const email = UserAttributes?.find(({ Name }) => Name === 'email')?.Value;

    return {
      statusCode: 200,
      body: {
        email,
      },
    };
  }
}
