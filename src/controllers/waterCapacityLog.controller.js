import {
  getWaterCapacityLogsByDeviceId,
  createNewWaterCapacityLog,
} from '../services/waterCapacityLog.service.js';
import { waterCapacityLogSchema } from '../validators/waterCapacityLog.validator.js';

export const fetchWaterCapacityLogs = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const logs = await getWaterCapacityLogsByDeviceId(Number(deviceId));
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const addWaterCapacityLog = async (req, res) => {
  // const { deviceId } = req.params;
  try {
    const { error, value } = waterCapacityLogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const newLog = await createNewWaterCapacityLog(value);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
