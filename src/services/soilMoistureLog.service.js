import { findDeviceById } from '../repositories/device.repository.js';
import {
  createSoilMoistureLog,
  findAllSoilMoistureLogsByDeviceId,
} from '../repositories/soilMoistureLog.repository.js';
import { sendNotification } from './fcm.service.js';
import { getWateringConfig } from './wateringConfig.service.js';
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
    let percent = ((dryThreshold - log.moist_value) * 100) / (dryThreshold - wetThreshold);
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return {
      ...log,
      moisture_percentage: percent,
    };
  });
};

export const createNewSoilMoistureLog = async (value) => {
  const log = await createSoilMoistureLog(value);
  const percent = ((dryThreshold - log.moist_value) * 100) / (dryThreshold - wetThreshold);
  broadcast({
    type: 'soil_moisture_log',
    id: log.id,
    device_id: value.device_id,
    moisture_percentage: percent,
    timestamp: new Date(),
  });

  const config = await getWateringConfig();
  // kirim notifikasi jika di bawah threshold dan automated watering nonaktif
  if (percent <= config.min_soil_moisture_percent && !config.automated) {
    await sendNotification({
      type: 'soil_moisture_below_min',
      title: 'Peringatan Kelembaban Tanah Rendah',
      body: `Kelembaban tanah saat ini ${percent.toFixed(2)}%. Segera siram tanaman`,
      moisture_percentage: percent.toFixed(2),
      timestamp: new Date(),
    });
  }
  return log;
};
