import prisma from '../libs/prisma.js';

export const findAllWaterContainersByDeviceId = async (deviceId) => {
  return await prisma.water_containers.findMany({
    where: { device_id: deviceId },
    include: {
      devices: true,
    },
  });
};

export const findFirstWaterContainerByDeviceId = async (deviceId) => {
  return await prisma.water_containers.findFirst({
    where: { device_id: deviceId },
  });
};

export const createWaterContainer = async (deviceId, containerData) => {
  return await prisma.water_containers.create({
    data: {
      device_id: deviceId,
      ...containerData,
    },
  });
};

export const updateWaterContainer = async (containerId, containerData) => {
  return await prisma.water_containers.update({
    where: { id: containerId },
    data: containerData,
  });
};

export const deleteWaterContainer = async (containerId) => {
  return await prisma.water_containers.delete({
    where: { id: containerId },
  });
};
