import express from 'express';
import tenantRouter from './tenant';
import bookRouter from './book';

const router = express.Router();

router.use('/api/tenants', tenantRouter);
router.use('/api/books', bookRouter);

export { router };