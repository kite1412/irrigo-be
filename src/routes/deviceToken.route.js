import express from 'express';
import { registerDeviceToken } from '../controllers/deviceToken.controller.js';

const router = express.Router();

router.post('/', registerDeviceToken);

export default router;
