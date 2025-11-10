import express from 'express';
import {
  fetchSoilMoistureLogs,
  addSoilMoistureLog,
} from '../controllers/soilMoistureLog.controller.js';

const router = express.Router();

router.get('/:deviceId', fetchSoilMoistureLogs);
router.post('/', addSoilMoistureLog);

export default router;
