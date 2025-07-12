import { APIGatewayProxyEventV2 } from 'aws-lambda';

// implement lambda function me
export async function handler(event: APIGatewayProxyEventV2) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      me: 'true',
    }),
  };
}
