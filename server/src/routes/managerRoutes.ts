import express from 'express';
import {
  getManager,
  createManager,
  updateManager,
} from '../controllers/managerControllers';

const router = express.Router();

router.post('/', createManager);
router.get('/:cognitoId', getManager);
router.put('/:cognitoId', updateManager);

export default router;
