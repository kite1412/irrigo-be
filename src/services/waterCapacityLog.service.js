import {
  findAllWaterCapacityLogsByDeviceId,
  createWaterCapacityLog,
} from '../repositories/waterCapacityLog.repository.js';
import { findDeviceById } from '../repositories/device.repository.js';
import { findFirstWaterContainerByDeviceId } from '../repositories/waterContainer.repository.js';
import { broadcast } from './websocket.service.js';

export const getWaterCapacityLogsByDeviceId = async (deviceId) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  return await findAllWaterCapacityLogsByDeviceId(deviceId);
};

export const createNewWaterCapacityLog = async (data) => {
  //   const device = await findDeviceById(waterCapacityData.device_id);
  //   if (!device) {
  //     const error = new Error('Device not found');
  //     error.status = 404;
  //     throw error;
  //   }

  const container = await findFirstWaterContainerByDeviceId(data.device_id);
  //   if (!container) {
  //     const error = new Error('Water container not found');
  //     error.status = 404;
  //     throw error;
  //   }
  //   console.log('container found:', container.id);
  const currHeightCm = container.height_cm - data.distance;
  const currLitres = (currHeightCm / container.height_cm) * container.capacity_litres;

  const WaterCapacityData = {
    current_height_cm: currHeightCm,
    current_litres: currLitres,
  };

  broadcast({
    type: 'water_capacity_log',
    device_id: data.device_id,
    current_height_cm: currHeightCm,
    current_litres: currLitres,
    timestamp: new Date(),
  });

  return await createWaterCapacityLog(container.id, WaterCapacityData);
};
