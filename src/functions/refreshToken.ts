import { RefreshTokenController } from '../controllers/RefreshTokenController';
import { httpAdapter } from '../utils/httpAdapter';

const refreshTokenController = new RefreshTokenController();

export const handler = httpAdapter(refreshTokenController);
