import { APIGatewayProxyResultV2 } from 'aws-lambda';

export function lambdaHttpResponse(
  statusCode: number,
  body?: Record<string, unknown>,
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
