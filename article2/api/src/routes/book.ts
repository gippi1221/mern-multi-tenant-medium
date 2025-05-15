import express from 'express';
import { extractTenant, setupTenant } from '../middleware/tenant';
import { createBook, getBooks } from "../controllers/book";

const router = express.Router();

router.use(extractTenant, setupTenant);

router.post('/', createBook);
router.get('/', getBooks);

export default router;