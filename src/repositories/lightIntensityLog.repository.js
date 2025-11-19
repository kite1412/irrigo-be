import prisma from '../libs/prisma.js';

export const findAllLightIntensityLogsByDeviceId = async (deviceId) => {
  return await prisma.light_intensity_logs.findMany({
    where: { device_id: deviceId },
    // include: { devices: true },
  });
};

export const createLightIntensityLog = async (data) => {
  return await prisma.light_intensity_logs.create({
    data: {
      device_id: data.device_id,
      lux: data.light_value,
      created_at: new Date(),
    },
  });
};
