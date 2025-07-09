import { createHmac } from 'node:crypto';

export function generateSecretHash(email: string) {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? '';

  return createHmac('SHA256', clientSecret)
    .update(`${email}${clientId}`)
    .digest('base64');
}
