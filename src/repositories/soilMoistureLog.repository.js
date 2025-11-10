import prisma from '../libs/prisma.js';

export const findAllSoilMoistureLogsByDeviceId = async (deviceId) => {
  return await prisma.soil_moisture_logs.findMany({
    where: {
      device_id: deviceId,
    },
    include: {
      devices: true,
    },
  });
};

export const createSoilMoistureLog = async (data) => {
  return await prisma.soil_moisture_logs.create({
    data,
  });
};
