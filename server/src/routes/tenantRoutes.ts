import express from 'express';
import {
  getTenant,
  createTenant,
  updateTenant,
  getTenantProperties,
} from '../controllers/tenantControllers';

const router = express.Router();

router.post('/', createTenant);
router.get('/:cognitoId', getTenant);
router.put('/:cognitoId', updateTenant);

router.get('/:cognitoId/properties', getTenantProperties);

export default router;
