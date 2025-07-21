import { SignInController } from '../controllers/SignInController';
import { httpAdapter } from '../utils/httpAdapter';

const signInController = new SignInController();

export const handler = httpAdapter(signInController);
