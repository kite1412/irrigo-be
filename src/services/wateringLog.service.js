import {
  findAllWateringLogsByDeviceId,
  createWateringLog,
} from '../repositories/wateringLog.repository.js';
import { findDeviceById } from '../repositories/device.repository.js';

export const getWateringLogsByDeviceId = async (deviceId) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  return await findAllWateringLogsByDeviceId(deviceId);
};

export const createNewWateringLog = async (value) => {
  const device = await findDeviceById(value.device_id);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  broadcast({
    type: 'watering_log',
    device_id: value.device_id,
    manual: value.manual,
    duration_ms: value.duration_ms,
    timestamp: new Date(),
  });
  return await createWateringLog(value);
};
