import express from 'express';
import multer from 'multer';
import {
  getProperties,
  getProperty,
  createProperty,
} from '../controllers/propertyControllers';
import { authMiddleware } from './../middleware/authMiddleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getProperties);
router.get('/', getProperty);
router.post(
  '/',
  authMiddleware(['manager']),
  upload.array('photos'),
  createProperty
);

export default router;
