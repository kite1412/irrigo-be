import {
  findAllWaterCapacityLogsByDeviceId,
  createWaterCapacityLog,
} from '../repositories/waterCapacityLog.repository.js';
import { findDeviceById } from '../repositories/device.repository.js';
import { findFirstWaterContainerByDeviceId } from '../repositories/waterContainer.repository.js';
import { broadcast } from './websocket.service.js';
import { sendNotification } from './fcm.service.js';
import { getWaterCapacityConfig } from './waterCapacityConfig.service.js';

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
  const container = await findFirstWaterContainerByDeviceId(data.device_id);
  const config = await getWaterCapacityConfig();
  const currHeightCm = container.height_cm - data.distance;
  const currLitres = (currHeightCm / container.height_cm) * container.capacity_litres;
  const currPercent = (currHeightCm / container.height_cm) * 100;

  const WaterCapacityData = {
    current_height_cm: currHeightCm,
    current_litres: currLitres,
  };

  const log = await createWaterCapacityLog(container.id, WaterCapacityData);

  broadcast({
    type: 'water_capacity_log',
    id: log.id,
    device_id: data.device_id,
    container_id: container.id,
    current_height_cm: currHeightCm,
    current_litres: currLitres,
    timestamp: new Date(),
  });

  if (currPercent <= config.min_water_capacity_percent) {
    await sendNotification(
      'Low Water Capacity Alert',
      `Water capacity is at ${currPercent.toFixed(2)}%. Please refill the water container.`,
      { current_percent: currPercent.toFixed(2), timestamp: new Date() }
    );
  }

  return log;
};
