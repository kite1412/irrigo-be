import prisma from '../libs/prisma.js';

export const findAllDeviceTokens = async () => {
  return await prisma.device_tokens.findMany();
};

export const findDeviceTokenByAndroidId = async (androidId) => {
  return await prisma.device_tokens.findUnique({
    where: { android_id: androidId },
  });
};

export const upsertDeviceToken = async (androidId, fcmToken) => {
  return await prisma.device_tokens.upsert({
    where: { android_id: androidId },
    update: { fcm_token: fcmToken },
    create: { android_id: androidId, fcm_token: fcmToken },
  });
};
