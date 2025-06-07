import express from 'express';
import { signIn, signUp, refreshToken, signOut, me } from '../controllers/auth';
import { extractTenant, setupTenant } from '../middleware/tenant';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(extractTenant, setupTenant);

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/signout', signOut);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, me);

export default router;
