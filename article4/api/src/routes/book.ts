import express from 'express';
import { extractTenant, setupTenant } from '../middleware/tenant';
import { createBook, deleteBook, getBooks } from "../controllers/book";

const router = express.Router();

router.use(extractTenant, setupTenant);

router.post('/', createBook);
router.get('/', getBooks);
router.delete('/:bookId', deleteBook);

export default router;
