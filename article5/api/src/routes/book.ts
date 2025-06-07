import express from 'express';
import { extractTenant, setupTenant } from '../middleware/tenant';
import { createBook, deleteBook, getBooks } from '../controllers/book';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(extractTenant, setupTenant, authenticate);

router.post('/', createBook);
router.get('/', getBooks);
router.delete('/:bookId', deleteBook);

export default router;
