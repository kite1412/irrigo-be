import {
  getAllDevices,
  getDeviceById,
  createNewDevice,
  updateExistingDevice,
  deleteExistingDevice,
} from '../services/device.service.js';
import { deviceSchema } from '../validators/device.validator.js';

export const fetchAllDevices = async (req, res) => {
  try {
    const devices = await getAllDevices();
    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const addDevice = async (req, res) => {
  const deviceData = req.body;
  try {
    const { error, value } = deviceSchema.validate(deviceData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const newDevice = await createNewDevice(value);
    res.status(201).json({ success: true, data: newDevice });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const modifyDevice = async (req, res) => {
  const { deviceId } = req.params;
  const deviceData = req.body;
  try {
    const { error, value } = deviceSchema.validate(deviceData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const updatedDevice = await updateExistingDevice(Number(deviceId), value);
    res.status(200).json({ success: true, data: updatedDevice });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const removeDevice = async (req, res) => {
  const { deviceId } = req.params;
  try {
    await deleteExistingDevice(Number(deviceId));
    res.status(200).json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
