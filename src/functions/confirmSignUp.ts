import { ConfirmSignUpController } from '../controllers/ConfirmSignUpController';
import { httpAdapter } from '../utils/httpAdapter';

const confirmSignUpController = new ConfirmSignUpController();

export const handler = httpAdapter(confirmSignUpController);
