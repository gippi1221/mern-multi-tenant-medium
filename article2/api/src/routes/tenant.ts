import express from 'express';
import { createTenant } from "../controllers/tenant";

const router = express.Router();

router.post('/', createTenant);

export default router;