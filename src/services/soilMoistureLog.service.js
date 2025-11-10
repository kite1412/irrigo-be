import {
  findAllSoilMoistureLogsByDeviceId,
  createSoilMoistureLog,
} from '../repositories/soilMoistureLog.repository.js';
import { findDeviceById } from '../repositories/device.repository.js';
import { broadcast } from './websocket.service.js';

const wetThreshold = 300;
const dryThreshold = 700;

export const getSoilMoistureLogsByDeviceId = async (deviceId) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  // kalkulasi moist_value ke persentase
  const logs = await findAllSoilMoistureLogsByDeviceId(deviceId);
  return logs.map((log) => {
    let percent = ((log.moist_value - wetThreshold) * 100) / (dryThreshold - wetThreshold);
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return {
      ...log,
      moisture_percentage: percent,
    };
  });
};

export const createNewSoilMoistureLog = async (value) => {
  //   const device = await findDeviceById(value.device_id);
  //   if (!device) {
  //     const error = new Error('Device not found');
  //     error.status = 404;
  //     throw error;
  //   }
  const percent = ((value.moist_value - wetThreshold) * 100) / (dryThreshold - wetThreshold);
  broadcast({
    type: 'soil_moisture_log',
    device_id: value.device_id,
    moisture_percentage: percent,
    timestamp: new Date(),
  });
  return await createSoilMoistureLog(value);
};
