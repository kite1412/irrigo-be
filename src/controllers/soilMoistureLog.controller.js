import {
  getSoilMoistureLogsByDeviceId,
  createNewSoilMoistureLog,
} from '../services/soilMoistureLog.service.js';
import { soilMoistureLogSchema } from '../validators/soilMoistureLog.validator.js';

export const fetchSoilMoistureLogs = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const logs = await getSoilMoistureLogsByDeviceId(Number(deviceId));
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const addSoilMoistureLog = async (req, res) => {
  //   const { deviceId } = req.params;
  try {
    const { error, value } = soilMoistureLogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const newLog = await createNewSoilMoistureLog(value);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
