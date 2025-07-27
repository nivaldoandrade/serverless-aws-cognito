import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamoClient';
import { env } from '../config/env';
import {
  ControllerResponse,
  IController,
  IControllerRequest,
} from './type/IController';

export class MeController implements IController {
  async execute({
    accountId,
  }: IControllerRequest): Promise<ControllerResponse> {
    const command = new QueryCommand({
      TableName: env.TABLE_NAME,
      Limit: 2,
      ProjectionExpression: '#email, #name, #type',
      KeyConditionExpression: '#PK = :PK',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#email': 'email',
        '#name': 'name',
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':PK': `ACCOUNT#${accountId}`,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);

    const profile = Items.find((item) => item.type === 'PROFILE');
    const account = Items.find((item) => item.type === 'ACCOUNT');

    if (!profile || !account) {
      throw new Error('Account not found.');
    }

    const user = {
      name: profile.name,
      email: account.email,
    };

    return {
      statusCode: 200,
      body: user,
    };
  }
}
