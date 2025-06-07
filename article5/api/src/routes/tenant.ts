import express from 'express';
import { createTenant, getTenantBySubdomain } from '../controllers/tenant';

const router = express.Router();

router.post('/', createTenant);
router.get('/:subdomain', getTenantBySubdomain);

export default router;
