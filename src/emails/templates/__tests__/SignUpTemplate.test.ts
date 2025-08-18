import { render } from '@react-email/components';
import { describe } from 'node:test';
import SignUpTemplate from '../SignUpTemplate';

describe('SignUpTemplate', () => {
  const confirmationCode = '12345678';

  it('should be render HTML containing heading, code and footer', async () => {
    const html = await render(SignUpTemplate({ confirmationCode }));

    expect(html).toContain('Código de confirmação de email');
    expect(html).toContain('12345678');
  });
});
