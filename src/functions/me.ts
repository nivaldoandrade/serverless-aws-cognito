import { MeController } from '../controllers/MeController';
import { httpAdapter } from '../utils/httpAdapter';

const meController = new MeController();

export const handler = httpAdapter(meController);
