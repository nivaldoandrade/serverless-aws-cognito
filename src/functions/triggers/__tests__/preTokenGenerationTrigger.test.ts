/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe } from 'node:test';
import { handler } from '../preTokenGenerationTrigger';

describe('preTokenGenerationTrigger', () => {
  const event = {
    request: {
      userAttributes: {
        'custom:internalId': 'internal-id',
      },
    },
  } as any;

  test('should be ', async () => {
    const result = await handler(event);

    expect(
      result.response.claimsAndScopeOverrideDetails.accessTokenGeneration
        ?.claimsToAddOrOverride,
    ).toEqual({
      internalId: 'internal-id',
    });
  });
});
