import express from 'express';
import { sendDummyNotification } from '../services/fcm.service.js';

const router = express.Router();

router.post('/test', sendDummyNotification);

export default router;
