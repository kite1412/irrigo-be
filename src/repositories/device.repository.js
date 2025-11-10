import prisma from '../libs/prisma.js';

export const findAllDevices = async () => {
  return await prisma.devices.findMany();
};

export const findDeviceById = async (deviceId) => {
  return await prisma.devices.findUnique({
    where: { id: deviceId },
  });
};

export const createDevice = async (deviceData) => {
  return await prisma.devices.create({
    data: deviceData,
  });
};

export const updateDevice = async (deviceId, deviceData) => {
  return await prisma.devices.update({
    where: { id: deviceId },
    data: deviceData,
  });
};

export const deleteDevice = async (deviceId) => {
  return await prisma.devices.delete({
    where: { id: deviceId },
  });
};
