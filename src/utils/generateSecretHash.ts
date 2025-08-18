import { createHmac } from 'node:crypto';
import { env } from '../config/env';

export function generateSecretHash(email: string) {
  const clientId = env.COGNITO_CLIENT_ID;
  const clientSecret = env.COGNITO_CLIENT_SECRET;

  return createHmac('SHA256', clientSecret)
    .update(`${email}${clientId}`)
    .digest('base64');
}
