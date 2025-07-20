import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';

const router = Router();

router.post('/auth/register', validateBody(registerSchema), registerController);
router.post('/auth/login', validateBody(loginSchema), loginController);
router.post('/auth/refresh', refreshController);
router.post('/auth/logout', logoutController);

export default router;
