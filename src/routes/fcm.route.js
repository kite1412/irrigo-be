import express from 'express';
import { testNotification } from '../controllers/fcm.controller.js';

const router = express.Router();

router.post('/test', testNotification);

export default router;
