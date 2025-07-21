import { ConfirmForgotPasswordController } from '../controllers/ConfirmForgotPasswordController';
import { httpAdapter } from '../utils/httpAdapter';

const confirmForgotPasswordController = new ConfirmForgotPasswordController();

export const handler = httpAdapter(confirmForgotPasswordController);
