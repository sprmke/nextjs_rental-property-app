import express from 'express';
import {
  getTenant,
  createTenant,
  updateTenant,
} from '../controllers/tenantControllers';

const router = express.Router();

router.post('/', createTenant);
router.get('/:cognitoId', getTenant);
router.put('/:cognitoId', updateTenant);

export default router;
