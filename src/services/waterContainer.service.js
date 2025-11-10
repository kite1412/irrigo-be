import {
  findAllWaterContainersByDeviceId,
  createWaterContainer,
  updateWaterContainer,
  deleteWaterContainer,
} from '../repositories/waterContainer.repository.js';
import { findDeviceById } from '../repositories/device.repository.js';

export const getWaterContainersByDeviceId = async (deviceId) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  return await findAllWaterContainersByDeviceId(deviceId);
};

export const createNewWaterContainer = async (deviceId, containerData) => {
  return await createWaterContainer(deviceId, containerData);
};

export const updateExistingWaterContainer = async (containerId, containerData) => {
  const container = await findAllWaterContainersByDeviceId(containerId);
  if (!container) {
    const error = new Error('Water container not found');
    error.status = 404;
    throw error;
  }
  return await updateWaterContainer(containerId, containerData);
};

export const deleteExistingWaterContainer = async (containerId) => {
  const container = await findAllWaterContainersByDeviceId(containerId);
  if (!container) {
    const error = new Error('Water container not found');
    error.status = 404;
    throw error;
  }
  return await deleteWaterContainer(containerId);
};
