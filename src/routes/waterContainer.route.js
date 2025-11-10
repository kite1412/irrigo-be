import express from 'express';
import {
  fetchWaterContainers,
  addWaterContainer,
  modifyWaterContainer,
  removeWaterContainer,
} from '../controllers/waterContainer.controller.js';

const router = express.Router();

router.get('/:deviceId', fetchWaterContainers);
router.post('/:deviceId', addWaterContainer);
router.patch('/:containerId', modifyWaterContainer);
router.delete('/:containerId', removeWaterContainer);

export default router;
