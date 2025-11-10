import express from 'express';
import { fetchWateringLogs, addWateringLog } from '../controllers/wateringLog.controller.js';

const router = express.Router();

router.get('/:deviceId', fetchWateringLogs);
router.post('/', addWateringLog);

export default router;
