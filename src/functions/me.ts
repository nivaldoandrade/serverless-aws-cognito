import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { cognitoClient } from '../clients/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const claims = event.requestContext.authorizer.jwt.claims;

  const command = new AdminGetUserCommand({
    Username: claims.sub as string,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  const email = UserAttributes?.find(({ Name }) => Name === 'email')?.Value;

  return {
    statusCode: 200,
    body: JSON.stringify({
      email,
    }),
  };
}
