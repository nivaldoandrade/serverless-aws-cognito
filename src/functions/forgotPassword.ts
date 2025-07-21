import { ForgotPasswordController } from '../controllers/ForgotPasswordController';
import { httpAdapter } from '../utils/httpAdapter';

const forgotPasswordController = new ForgotPasswordController();

export const handler = httpAdapter(forgotPasswordController);
