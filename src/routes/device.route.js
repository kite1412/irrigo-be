import { fetchAllDevices, addDevice } from '../controllers/device.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchAllDevices);
router.post('/', addDevice);

export default router;
