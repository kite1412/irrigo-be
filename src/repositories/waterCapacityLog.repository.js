import prisma from '../libs/prisma.js';

export const findAllWaterCapacityLogsByDeviceId = async (deviceId) => {
  return await prisma.water_capacity_logs.findMany({
    where: {
      water_containers: {
        device_id: deviceId,
      },
    },
    include: {
      water_containers: true,
    },
  });
};

export const createWaterCapacityLog = async (containerId, waterCapacityLogData) => {
  return await prisma.water_capacity_logs.create({
    data: {
      container_id: containerId,
      ...waterCapacityLogData,
    },
  });
};
