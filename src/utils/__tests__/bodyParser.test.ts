import { describe } from 'node:test';
import { bodyParser } from '../bodyParser';

describe('bodyParses', () => {
  test('should be successfully return object', () => {
    const body = '{"name": "John Doe", "email:": "john.doe@mail.com"}';
    const mockResult = JSON.parse(body);

    const result = bodyParser(body);

    expect(result).toEqual(mockResult);
  });

  test('should be return empty object when body does not exist', () => {
    const parseSpy = jest.spyOn(JSON, 'parse');
    const bodyEmpty = undefined;

    const result = bodyParser(bodyEmpty);

    expect(result).toEqual({});
    expect(parseSpy).toHaveBeenCalledTimes(0);
  });

  test('should be catch error when body has been Malformed', () => {
    const invalidBody = '{"name": "John Doe", "email:": "johndoe@mail.com"';

    expect(() => bodyParser(invalidBody)).toThrow('Malformed body.');
  });
});
