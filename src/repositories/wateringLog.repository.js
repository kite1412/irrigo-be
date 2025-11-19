import prisma from '../libs/prisma.js';

export const findAllWateringLogsByDeviceId = async (deviceId) => {
  return await prisma.watering_logs.findMany({
    where: { device_id: deviceId },
    // include: {
    //   devices: true,
    // },
  });
};

export const createWateringLog = async (data) => {
  return await prisma.watering_logs.create({
    data,
  });
};
