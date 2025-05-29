import express from 'express';
import tenantRouter from './tenant';
import bookRouter from './book';
import authRouter from './auth';

const router = express.Router();

router.use('/api/auth', authRouter);
router.use('/api/tenants', tenantRouter);
router.use('/api/books', bookRouter);

export { router };
