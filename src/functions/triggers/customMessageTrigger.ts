import { render } from '@react-email/components';
import { CustomMessageTriggerEvent } from 'aws-lambda';
import ForgotPasswordTemplate from '../../emails/templates/ForgotPasswordTemplate';
import SignUpTemplate from '../../emails/templates/SignUpTemplate';

export async function handler(event: CustomMessageTriggerEvent) {
  const code = event.request.codeParameter;

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const html = await render(
      ForgotPasswordTemplate({ confirmationCode: code }),
    );

    event.response.emailSubject = 'Código de recuperação de senha';
    event.response.emailMessage = html;
  }

  if (event.triggerSource === 'CustomMessage_SignUp') {
    const html = await render(SignUpTemplate({ confirmationCode: code }));

    event.response.emailSubject = 'Código de confirmação de email';
    event.response.emailMessage = html;
  }

  return event;
}
