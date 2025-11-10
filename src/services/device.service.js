import {
  findAllDevices,
  findDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} from '../repositories/device.repository.js';

export const getAllDevices = async () => {
  return await findAllDevices();
};

export const getDeviceById = async (deviceId) => {
  return await findDeviceById(deviceId);
};

export const createNewDevice = async (deviceData) => {
  return await createDevice(deviceData);
};

export const updateExistingDevice = async (deviceId, deviceData) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  return await updateDevice(deviceId, deviceData);
};

export const deleteExistingDevice = async (deviceId) => {
  const device = await findDeviceById(deviceId);
  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    throw error;
  }
  return await deleteDevice(deviceId);
};
