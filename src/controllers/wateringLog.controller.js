import {
  getWateringLogsByDeviceId,
  createNewWateringLog,
} from '../services/wateringLog.service.js';
import { wateringLogSchema } from '../validators/wateringLog.validator.js';

export const fetchWateringLogs = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const logs = await getWateringLogsByDeviceId(Number(deviceId));
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const addWateringLog = async (req, res) => {
  // const { deviceId } = req.params;
  try {
    const { error, value } = wateringLogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const newLog = await createNewWateringLog(value);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
