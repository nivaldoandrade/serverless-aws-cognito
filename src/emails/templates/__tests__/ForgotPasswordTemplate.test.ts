import { render } from '@react-email/components';
import { describe } from 'node:test';
import ForgotPasswordTemplate from '../ForgotPasswordTemplate';

describe('ForgotPasswordTemplate', () => {
  const confirmationCode = '12345678';

  it('should be render HTML containing heading, code and footer', async () => {
    const html = await render(ForgotPasswordTemplate({ confirmationCode }));

    expect(html).toContain('Código de recuperação de senha');
    expect(html).toContain('12345678');
  });
});
