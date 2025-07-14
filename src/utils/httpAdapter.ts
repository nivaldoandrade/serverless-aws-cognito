import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { $ZodError } from 'zod/v4/core';
import { IController } from '../controllers/type/IController';
import { bodyParser } from './bodyParser';
import { lambdaHttpResponse } from './lambdaHttpResponse';

export function httpAdapter(controller: IController) {
  return async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> => {
    const body = bodyParser(event.body);
    try {
      const { statusCode, body: resultBody } = await controller.execute({
        body,
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
