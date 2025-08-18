/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@react-email/components';
import { describe } from 'node:test';
import ForgotPasswordTemplate from '../../../emails/templates/ForgotPasswordTemplate';
import SignUpTemplate from '../../../emails/templates/SignUpTemplate';
import { handler } from '../customMessageTrigger';

jest.mock('@react-email/components', () => ({
  render: jest.fn(),
}));

jest.mock('../../../emails/templates/ForgotPasswordTemplate', () => jest.fn());
jest.mock('../../../emails/templates/SignUpTemplate', () => jest.fn());

const mockRender = render as jest.Mock;
const mockForgotPasswordTemplate =
  ForgotPasswordTemplate as unknown as jest.Mock;
const mockSignUpTemplate = SignUpTemplate as unknown as jest.Mock;

describe('customMessageTrigger', () => {
  let baseEvent: any;

  beforeAll(() => {
    baseEvent = {
      request: {
        codeParameter: '12345678',
      },
      response: {},
    };

    jest.clearAllMocks();
  });

  test('should be handle CustomMessage_ForgotPassword trigger', async () => {
    mockForgotPasswordTemplate.mockReturnValueOnce(
      'mockForgotPasswordTemplate',
    );
    mockRender.mockResolvedValueOnce('html');

    const event = {
      ...baseEvent,
      triggerSource: 'CustomMessage_ForgotPassword',
    };

    const result = await handler(event);

    expect(result.triggerSource).toBe('CustomMessage_ForgotPassword');
    expect(mockRender).toHaveBeenCalledWith('mockForgotPasswordTemplate');
    expect(mockForgotPasswordTemplate).toHaveBeenCalledWith({
      confirmationCode: '12345678',
    });
    expect(result.response.emailSubject).toBe('Código de recuperação de senha');
    expect(result.response.emailMessage).toBe('html');
    expect(mockSignUpTemplate).not.toHaveBeenCalled();
  });

  test('should be handle CustomMessage_SignUp trigger', async () => {
    mockSignUpTemplate.mockReturnValueOnce('mockSignUpTemplate');
    mockRender.mockResolvedValueOnce('html');

    const event = {
      ...baseEvent,
      triggerSource: 'CustomMessage_SignUp',
    };

    const result = await handler(event);

    expect(result.triggerSource).toBe('CustomMessage_SignUp');
    expect(mockRender).toHaveBeenCalledWith('mockSignUpTemplate');
    expect(mockSignUpTemplate).toHaveBeenCalledWith({
      confirmationCode: '12345678',
    });
    expect(result.response.emailSubject).toBe('Código de confirmação de email');
    expect(result.response.emailMessage).toBe('html');
    expect(mockForgotPasswordTemplate).not.toHaveBeenCalled();
  });

  test('should be return event if triggerSource is unknown', async () => {
    const event = {
      ...baseEvent,
      triggerSource: 'Unknown_Trigger',
      response: {
        emailSubject: 'Subject email default',
        emailMessage: 'Message email default',
      },
    };

    const result = await handler(event);

    expect(result).toEqual(event);
    expect(mockRender).not.toHaveBeenCalled();
    expect(mockForgotPasswordTemplate).not.toHaveBeenCalled();
    expect(mockSignUpTemplate).not.toHaveBeenCalled();
  });
});
