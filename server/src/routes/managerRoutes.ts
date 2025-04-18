import express from 'express';
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from '../controllers/managerControllers';

const router = express.Router();

router.post('/', createManager);
router.get('/:cognitoId', getManager);
router.put('/:cognitoId', updateManager);

router.get('/:cognitoId/manager-properties', getManagerProperties);

export default router;
