import express from 'express';
import {
  fetchWaterCapacityLogs,
  addWaterCapacityLog,
} from '../controllers/waterCapacityLog.controller.js';

const router = express.Router();

router.get('/:deviceId', fetchWaterCapacityLogs);
router.post('/', addWaterCapacityLog);

export default router;
