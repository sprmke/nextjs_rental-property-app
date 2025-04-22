import express from 'express';
import {
  createApplication,
  updateApplicationStatus,
  getApplications,
} from '../controllers/applicationControllers';
import { authMiddleware } from './../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware(['tenant']), createApplication);
router.put(
  '/:id/status',
  authMiddleware(['managers']),
  updateApplicationStatus
);
router.get('/', authMiddleware(['manager', 'tenant']), getApplications);

export default router;
