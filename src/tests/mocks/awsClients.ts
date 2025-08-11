import { cognitoClient } from '../../clients/cognitoClient';
import { dynamoClient } from '../../clients/dynamoClient';

jest.mock('../../clients/cognitoClient', () => ({
  cognitoClient: { send: jest.fn() },
}));

jest.mock('../../clients/dynamoClient', () => ({
  dynamoClient: { send: jest.fn() },
}));

export const mockCognitoSend = cognitoClient.send as jest.Mock;
export const mockDynamoSend = dynamoClient.send as jest.Mock;
