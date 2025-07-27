import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { $ZodError } from 'zod/v4/core';
import { IController } from '../controllers/type/IController';
import { bodyParser } from './bodyParser';
import { lambdaHttpResponse } from './lambdaHttpResponse';

type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;

export function httpAdapter(controller: IController) {
  return async (event: Event): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = bodyParser(event.body);

      const accountId =
        'authorizer' in event.requestContext
          ? (event.requestContext.authorizer.jwt.claims['internalId'] as string)
          : undefined;

      const { statusCode, body: resultBody } = await controller.execute({
        body,
        accountId,
      });

      return lambdaHttpResponse(statusCode, resultBody);
    } catch (error) {
      if (error instanceof $ZodError) {
        return lambdaHttpResponse(400, {
          message: error.issues.map((error) => ({
            field: error.path.join('.'),
            error: error.message,
          })),
        });
      }

      console.log(error);

      return lambdaHttpResponse(500, {
        statusCode: 500,
        message: 'Internal Server Error.',
      });
    }
  };
}
