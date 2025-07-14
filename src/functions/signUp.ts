import { SignUpController } from '../controllers/SignUpController';
import { httpAdapter } from '../utils/httpAdapter';

const signUpController = new SignUpController();

export const handler = httpAdapter(signUpController);
