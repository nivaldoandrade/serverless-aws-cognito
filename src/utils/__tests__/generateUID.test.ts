import { describe } from 'node:test';
import { generateUID } from '../generateUID';

describe('generateUID', () => {
  test('should be generate unique ID', () => {
    const result = generateUID();

    expect(typeof result).toBe('string');
  });

  test('should be generate two different IDs', () => {
    const result1 = generateUID();
    const result2 = generateUID();

    expect(result1).not.toBe(result2);
  });
});
