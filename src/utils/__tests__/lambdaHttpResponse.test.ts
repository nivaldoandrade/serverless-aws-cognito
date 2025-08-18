import { describe } from 'node:test';
import { lambdaHttpResponse } from '../lambdaHttpResponse';

describe('lambdaHttpResponse', () => {
  test('should be formated and return payload', () => {
    const body = {
      name: 'John Doe',
      email: 'john.doe@mail.com',
    };

    const bodyResult = JSON.stringify(body);

    const result = lambdaHttpResponse(200, body);

    expect(result).toEqual({
      statusCode: 200,
      body: bodyResult,
    });
  });

  test('should be return payload without body', () => {
    const result = lambdaHttpResponse(200);

    expect(result).toEqual({
      statusCode: 200,
    });
  });
});
